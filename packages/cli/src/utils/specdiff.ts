import type { ContractInterface } from "@soropkg/core";

// ─── Normalized, machine-comparable spec representation ──────────────────────
//
// ContractInterface is optimized for display (ordered arrays, context fields).
// For diffing we need keyed lookups and deterministic ordering so that two
// binaries with identical interfaces always produce identical snapshots.

export interface FnSig {
  inputs: { name: string; type: string }[];
  outputs: string[];
}

export interface TypeShape {
  kind: "struct" | "enum" | "union";
  fields?: { name: string; type: string }[];
  cases?: { name: string; value?: number; fieldTypes?: string[] }[];
}

export interface SpecSnapshot {
  functions: Record<string, FnSig>;
  types: Record<string, TypeShape>;
  errors: Record<string, number>; // error name → code
}

export type ChangeSeverity = "breaking" | "nonbreaking";

export interface SpecChange {
  severity: ChangeSeverity;
  kind: string;
  message: string;
}

// Convert a decoded ContractInterface into a normalized snapshot.
// Ordering is normalized (sorted keys) so binary layout differences that
// don't affect the interface never show up as diffs.
export function snapshotFromInterface(iface: ContractInterface): SpecSnapshot {
  const functions: Record<string, FnSig> = {};
  for (const fn of iface.functions) {
    functions[fn.name] = {
      inputs: fn.inputs.map((i) => ({ name: i.name, type: i.type })),
      outputs: fn.outputs.map((o) => o.type),
    };
  }

  const types: Record<string, TypeShape> = {};
  for (const t of iface.types) {
    const shape: TypeShape = { kind: t.kind };
    if (t.kind === "struct") {
      shape.fields = (t.fields ?? []).map((f) => ({ name: f.name, type: f.type }));
    } else if (t.kind === "enum") {
      shape.cases = (t.cases ?? []).map((c) => ({ name: c.name, value: c.value }));
    } else {
      // union — case identity is name + ordered payload types (synthetic
      // field_N names are an artifact of decoding, ignore them)
      shape.cases = (t.cases ?? []).map((c) => ({
        name: c.name,
        fieldTypes: (c.fields ?? []).map((f) => f.type),
      }));
    }
    types[t.name] = shape;
  }

  const errors: Record<string, number> = {};
  for (const e of iface.errors) {
    errors[e.name] = e.code;
  }

  return { functions, types, errors };
}

// ─── Diff ─────────────────────────────────────────────────────────────────────
//
// Severity model (M0):
//   BREAKING     — a compiled client against snapshot A can fail or misbehave
//                  against snapshot B at runtime.
//   NON-BREAKING — additive or metadata-only; existing clients keep working.
//
// Function signatures are compared positionally (generated clients call by
// position) with args matched by name for precise add/remove/change reports.

function diffFn(name: string, a: FnSig, b: FnSig, out: SpecChange[]): void {
  const aByName = new Map(a.inputs.map((i) => [i.name, i]));
  const bByName = new Map(b.inputs.map((i) => [i.name, i]));

  let structuralDiff = false;

  for (const [argName, aArg] of aByName) {
    const bArg = bByName.get(argName);
    if (!bArg) {
      out.push({ severity: "breaking", kind: "arg.removed", message: `${name}: argument \`${argName}: ${aArg.type}\` was removed` });
      structuralDiff = true;
    } else if (bArg.type !== aArg.type) {
      out.push({ severity: "breaking", kind: "arg.type-changed", message: `${name}: argument \`${argName}\` changed type ${aArg.type} → ${bArg.type}` });
      structuralDiff = true;
    }
  }

  for (const [argName, bArg] of bByName) {
    if (!aByName.has(argName)) {
      out.push({ severity: "breaking", kind: "arg.added", message: `${name}: new argument \`${argName}: ${bArg.type}\` is required` });
      structuralDiff = true;
    }
  }

  // Same arg set but different positions → positional callers break silently.
  if (
    !structuralDiff &&
    a.inputs.length === b.inputs.length &&
    a.inputs.some((aArg, i) => aArg.name !== b.inputs[i].name)
  ) {
    out.push({ severity: "breaking", kind: "args.reordered", message: `${name}: arguments were reordered (${a.inputs.map((i) => i.name).join(", ")} → ${b.inputs.map((i) => i.name).join(", ")})` });
  }

  const aOut = a.outputs.join(", ");
  const bOut = b.outputs.join(", ");
  if (aOut !== bOut) {
    out.push({ severity: "breaking", kind: "return.changed", message: `${name}: return type changed (${aOut || "void"} → ${bOut || "void"})` });
  }
}

function describeType(shape: TypeShape): string {
  if (shape.kind === "struct") {
    return (shape.fields ?? []).map((f) => `${f.name}: ${f.type}`).join(", ");
  }
  if (shape.kind === "enum") {
    return (shape.cases ?? []).map((c) => `${c.name}=${c.value}`).join(", ");
  }
  return (shape.cases ?? [])
    .map((c) => (c.fieldTypes?.length ? `${c.name}(${c.fieldTypes.join(", ")})` : c.name))
    .join(" | ");
}

export function diffSnapshots(a: SpecSnapshot, b: SpecSnapshot): SpecChange[] {
  const changes: SpecChange[] = [];

  // Functions
  for (const [name, aSig] of Object.entries(a.functions)) {
    const bSig = b.functions[name];
    if (!bSig) {
      changes.push({ severity: "breaking", kind: "function.removed", message: `function \`${name}\` was removed` });
    } else {
      diffFn(name, aSig, bSig, changes);
    }
  }
  for (const name of Object.keys(b.functions)) {
    if (!a.functions[name]) {
      changes.push({ severity: "nonbreaking", kind: "function.added", message: `function \`${name}\` was added` });
    }
  }

  // Errors — matched by name; codes must be stable.
  for (const [name, aCode] of Object.entries(a.errors)) {
    const bCode = b.errors[name];
    if (bCode === undefined) {
      changes.push({ severity: "nonbreaking", kind: "error.removed", message: `error \`${name}=${aCode}\` no longer exists` });
    } else if (bCode !== aCode) {
      changes.push({ severity: "breaking", kind: "error.repurposed", message: `error \`${name}\` changed code ${aCode} → ${bCode}` });
    }
  }
  // Codes must also be unique across both snapshots — a code reused under a
  // different name means clients matching on the old meaning misinterpret it.
  const aCodes = new Map(Object.entries(a.errors).map(([n, c]) => [c, n]));
  for (const [name, bCode] of Object.entries(b.errors)) {
    if (a.errors[name] === undefined) {
      const previousName = aCodes.get(bCode);
      if (previousName !== undefined && previousName !== name) {
        changes.push({ severity: "breaking", kind: "error.repurposed", message: `error code ${bCode} was repurposed: \`${previousName}\` → \`${name}\`` });
      } else {
        changes.push({ severity: "nonbreaking", kind: "error.added", message: `new error \`${name}=${bCode}\` added` });
      }
    }
  }

  // Types — conservative: any shape change or removal is treated as breaking,
  // because generated clients embed these shapes in their constructors and
  // XDR (de)serializers.
  for (const [name, aShape] of Object.entries(a.types)) {
    const bShape = b.types[name];
    if (!bShape) {
      changes.push({ severity: "breaking", kind: "type.removed", message: `type \`${name}\` was removed` });
    } else if (JSON.stringify(aShape) !== JSON.stringify(bShape)) {
      changes.push({ severity: "breaking", kind: "type.changed", message: `type \`${name}\` changed (${describeType(aShape)} → ${describeType(bShape)})` });
    }
  }
  for (const name of Object.keys(b.types)) {
    if (!a.types[name]) {
      changes.push({ severity: "nonbreaking", kind: "type.added", message: `type \`${name}\` was added` });
    }
  }

  const severityOrder = { breaking: 0, nonbreaking: 1 } as const;
  return changes.sort(
    (x, y) =>
      severityOrder[x.severity] - severityOrder[y.severity] ||
      x.kind.localeCompare(y.kind) ||
      x.message.localeCompare(y.message)
  );
}

// ─── Report rendering ─────────────────────────────────────────────────────────

export function renderSpecDiffReport(
  contractId: string,
  network: string,
  hashA: string,
  hashB: string,
  changes: SpecChange[]
): string {
  const lines: string[] = [];
  const breaking = changes.filter((c) => c.severity === "breaking");
  const nonBreaking = changes.filter((c) => c.severity === "nonbreaking");

  lines.push("");
  lines.push(`Contract: ${contractId}`);
  lines.push(`Network:  ${network}`);
  lines.push(`From:     ${shortHash(hashA)}`);
  lines.push(`To:       ${shortHash(hashB)}`);
  lines.push("");

  if (changes.length === 0) {
    lines.push("No interface changes detected.");
    return lines.join("\n");
  }

  if (breaking.length > 0) {
    lines.push(`BREAKING CHANGES (${breaking.length})`);
    for (const c of breaking) lines.push(`  ✗ ${c.message}`);
    lines.push("");
  }

  if (nonBreaking.length > 0) {
    lines.push(`NON-BREAKING CHANGES (${nonBreaking.length})`);
    for (const c of nonBreaking) lines.push(`  + ${c.message}`);
    lines.push("");
  }

  lines.push(`─── ${breaking.length} breaking, ${nonBreaking.length} non-breaking ───`);
  return lines.join("\n");
}

function shortHash(hash: string): string {
  return hash.length > 16 ? `${hash.slice(0, 8)}…${hash.slice(-8)}` : hash;
}

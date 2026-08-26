import { Router, Request, Response } from "express";
import type { ApiResponse, ApiError, Package } from "@soropkg/core";

// TODO(contributor): wire up Postgres via the db service

export const packagesRouter = Router();

// GET /packages/:org/:name
// Returns package metadata and all published versions.
packagesRouter.get("/:org/:name", async (req: Request, res: Response) => {
  const { org, name } = req.params;

  // TODO: query db.packages.findOne({ org, name })
  // For now returns a 501 so contributors know exactly where to hook in.

  const error: ApiError = {
    error: "Not implemented",
    code: "NOT_IMPLEMENTED",
    details: { org, name },
  };
  res.status(501).json(error);
});

// GET /packages/:org/:name/:version
// Returns a specific published version.
packagesRouter.get("/:org/:name/:version", async (req: Request, res: Response) => {
  const { org, name, version } = req.params;

  // TODO: query db.versions.findOne({ org, name, version })

  const error: ApiError = {
    error: "Not implemented",
    code: "NOT_IMPLEMENTED",
    details: { org, name, version },
  };
  res.status(501).json(error);
});

// GET /packages
// List all packages, paginated.
packagesRouter.get("/", async (req: Request, res: Response) => {
  const _page = Number(req.query.page ?? 1);
  const _perPage = Number(req.query.per_page ?? 20);

  // TODO: query db.packages.list({ page, perPage })

  const response: ApiResponse<Package[]> = {
    data: [],
    meta: { total: 0, page: _page, per_page: _perPage },
  };
  res.json(response);
});

// POST /packages
// Publish a new package or a new version.
// Requires Authorization: Bearer <github-oauth-token>
packagesRouter.post("/", async (req: Request, res: Response) => {
  // TODO(contributor): implement publishing flow
  //
  // Steps:
  // 1. Verify GitHub OAuth token (call GitHub API to get user identity)
  // 2. Validate request body against PackagePublishSchema (zod)
  // 3. For each declared contract ID, call Stellar RPC to verify wasm hash matches
  // 4. Insert into packages + versions tables
  // 5. Return published package URL

  const error: ApiError = {
    error: "Not implemented",
    code: "NOT_IMPLEMENTED",
  };
  res.status(501).json(error);
});

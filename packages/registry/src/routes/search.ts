import { Router, Request, Response } from "express";
import type { ApiResponse, SearchResult } from "@soropkg/core";

// TODO(contributor): implement full-text search against Postgres
//
// Query params:
//   q         — text query (name, description, tags)
//   category  — filter by category (DeFi, Oracle, Token, etc.)
//   network   — filter by network (mainnet | testnet)
//   page      — page number (default 1)
//   per_page  — results per page (default 20, max 100)

export const searchRouter = Router();

searchRouter.get("/", async (req: Request, res: Response) => {
  const _q = (req.query.q as string) ?? "";
  const _page = Number(req.query.page ?? 1);
  const _perPage = Math.min(Number(req.query.per_page ?? 20), 100);

  // TODO: db.packages.search({ q, page, perPage })

  const response: ApiResponse<SearchResult> = {
    data: {
      packages: [],
      total: 0,
      page: _page,
      perPage: _perPage,
    },
  };
  res.json(response);
});

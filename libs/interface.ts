import { NextServer } from "next/dist/server/next";

export abstract class IServer {
  static nextApp: NextServer;
  start: () => void;
}

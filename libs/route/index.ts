import { NextServer } from 'next/dist/server/next';
import { NextMiddlewareResult } from 'next/dist/server/web/types';
import { NextRequest, NextResponse } from 'next/server';
import {
  BaseNextRequest,
  BaseNextResponse,
} from 'next/dist/server/base-http/index';
import { IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import Exception from '@libs/exception/index.ts';

interface IMiddleware {
  (req: NextRequest, res: NextResponse, next): NextMiddlewareResult;
}

export default class Route {
  public router;
  public method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  public prefix: string;
  // Url
  public url: string;
  // Pattern : /page/...
  public pathName: string;
  public request: BaseNextRequest<any> | IncomingMessage;
  public response: BaseNextResponse<any> | ServerResponse<IncomingMessage>;
  public middleware: IMiddleware[] = [];

  constructor() {
    this.router = require('express').Router();
  }

  get(url: string, pathName: string) {
    this.method = 'GET';
    return this.addAction(url, pathName, this.method);
  }

  post(url: string, pathName: string) {
    this.method = 'POST';
    return this.addAction(url, pathName, this.method);
  }

  put(url: string, pathName: string) {
    this.method = 'PUT';
    return this.addAction(url, pathName, this.method);
  }

  delete(url: string, pathName: string) {
    this.method = 'DELETE';
    return this.addAction(url, pathName, this.method);
  }

  addAction(url, pathName, method) {
    this.url = url;
    this.pathName = pathName;
    this.method = method.toLowerCase();
    return this;
  }

  setMethod(method) {
    this.method = method;
    return this;
  }

  setRequest(request: BaseNextRequest<any> | IncomingMessage) {
    this.request = request;
    return this;
  }

  setResponse(
    response: BaseNextResponse<any> | ServerResponse<IncomingMessage>,
  ) {
    this.response = response;
    return this;
  }

  setPath(path: string) {
    this.pathName = path;
    return this;
  }

  setPrefix(prefix: string) {
    this.prefix = prefix;
    return this;
  }

  setMiddleware(middleware: IMiddleware[]) {
    this.middleware = middleware;
    return this;
  }

  async build() {
    const pathName: string = this.pathName.substring(5);
    console.log(!!this.router, this.method, this.url, pathName);
    this.router[this.method](
      this.url,
      ...this.middleware,
      async (req, res) => {
        try {
            const nextApp: NextServer = (await import('../Server.ts')).default
              .nextApp;
            console.log(!!nextApp, pathName);
            this.request = req;
            this.response = res;
            const parsedUrl = parse(this.request.url, true);
            const { query } = parsedUrl;
            await nextApp.render(this.request, this.response, pathName, query);
        } catch (e) {
            Exception.handle(req, res, e);
        }
      },
    );
  }
}

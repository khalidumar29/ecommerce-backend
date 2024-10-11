import { Express, Response, Request } from "express";
import config from "./config.json";
import axios from "axios";

export const proxyRequest = (
  hostname: string,
  path: string,
  method: string
) => {
  return async (req: Request, res: Response) => {
    try {
      let url = `${hostname}${path}`;
      req.params &&
        Object.keys(req.params).forEach((key) => {
          url = url.replace(`:${key}`, req.params[key]);
        });

      const { data } = await axios({
        method,
        url,
        data: req.body,
        headers: {
          origin: "http://localhost:8081",
        },
      });
      res.json(data);
    } catch (error) {
      if (error instanceof axios.AxiosError) {
        return res
          .status(error.response?.status || 500)
          .json(error.response?.data);
      }
      console.error(error);
      return res.status(500).json({
        message: "Internal Server Error",
      });
    }
  };
};

export const configureRoutes = (app: Express) => {
  Object.entries(config.services).forEach(([name, service]) => {
    const hostname = service.url;
    service.routes.forEach((route) => {
      route.methods.forEach((method) => {
        const handler = proxyRequest(hostname, route.path, method);
        app[method](`/api${route.path}`, handler);
      });
    });
  });
};

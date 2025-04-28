import "reflect-metadata";
import { Container } from "inversify";
import { type IHttpService, HttpService } from "@/services/HttpService";
import { type IApiService, ApiService } from "@/services/ApiService";
import { SYMBOLS } from "@/constants";

const container = new Container();

container.bind<IHttpService>(SYMBOLS.IHttpService).to(HttpService).inSingletonScope();
container.bind<IApiService>(SYMBOLS.IApiService).to(ApiService).inSingletonScope();

export default container;

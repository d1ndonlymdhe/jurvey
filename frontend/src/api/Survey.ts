/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import {
  AddTextDataPointRequest,
  BasicSurveyResDTO,
  CreateSurveyRequest,
  DetailedSurveyResDTO,
  SelectDataPointDTO,
  TextDataPointDTO,
} from "./data-contracts";
import { ContentType, HttpClient, RequestParams } from "./http-client";

export class Survey<
  SecurityDataType = unknown,
> extends HttpClient<SecurityDataType> {
  /**
   * No description
   *
   * @tags Survey Datapoint API
   * @name CreateTextDataPoint
   * @request POST:/survey/datapoint/text
   */
  createTextDataPoint = (
    data: AddTextDataPointRequest,
    params: RequestParams = {},
  ) =>
    this.request<SelectDataPointDTO | TextDataPointDTO, any>({
      path: `/survey/datapoint/text`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Survey API
   * @name CreateSurvey
   * @request POST:/survey/
   */
  createSurvey = (data: CreateSurveyRequest, params: RequestParams = {}) =>
    this.request<BasicSurveyResDTO, any>({
      path: `/survey/`,
      method: "POST",
      body: data,
      type: ContentType.Json,
      ...params,
    });
  /**
   * No description
   *
   * @tags Survey API
   * @name GetAllSurvey
   * @request GET:/survey
   */
  getAllSurvey = (params: RequestParams = {}) =>
    this.request<BasicSurveyResDTO[], any>({
      path: `/survey`,
      method: "GET",
      ...params,
    });
  /**
   * No description
   *
   * @tags Survey API
   * @name GetSurvey
   * @request GET:/survey/{id}
   */
  getSurvey = (id: string, params: RequestParams = {}) =>
    this.request<DetailedSurveyResDTO, any>({
      path: `/survey/${id}`,
      method: "GET",
      ...params,
    });
}

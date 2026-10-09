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

type UtilRequiredKeys<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;

export interface DatapointDTO {
  id: string;
  label: string;
  surveyId: string;
  type: string;
}

export interface AddTextDataPointRequest {
  surveyId: string;
  label: string;
}

export interface BasicSurveyResDTO {
  id?: string;
  name?: string;
}

export interface CreateSurveyRequest {
  name: string;
}

export interface DetailedSurveyResDTO {
  id?: string;
  name?: string;
  dataPoints: (SelectDataPointDTO | TextDataPointDTO)[];
}

export type SelectDataPointDTO = UtilRequiredKeys<
  DatapointDTO,
  "id" | "label" | "surveyId"
> & {
  allowedValues: string[];
};

export type TextDataPointDTO = UtilRequiredKeys<
  DatapointDTO,
  "id" | "label" | "surveyId"
>;

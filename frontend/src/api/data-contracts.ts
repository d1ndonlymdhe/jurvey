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

export type DatapointDTO = BaseDatapointDto &
  (
    | BaseDatapointDtoTypeMapping<"text", TextDataPointDTO>
    | BaseDatapointDtoTypeMapping<"select", SelectDataPointDTO>
  );

export interface CreateSurveyRequest {
  name: string;
  title: string;
  description: string;
}

export interface BasicSurveyResDTO {
  id: string;
  name: string;
  /** @format int64 */
  questionCount: number;
  title: string;
  description: string;
}

export interface DetailedSurveyResDTO {
  id: string;
  name: string;
  /** @format int64 */
  questionCount: number;
  title: string;
  description: string;
  dataPoints: (SelectDataPointDTO | TextDataPointDTO)[];
}

export type SelectDataPointDTO = UtilRequiredKeys<
  BaseDatapointDto,
  "id" | "label" | "surveyId"
> & {
  allowedValues: string[];
};

export type TextDataPointDTO = UtilRequiredKeys<
  BaseDatapointDto,
  "id" | "label" | "surveyId"
>;

export interface AddTextDataPointRequest {
  surveyId: string;
  label: string;
}

interface BaseDatapointDto {
  id: string;
  label: string;
  surveyId: string;
  type: string;
}

type BaseDatapointDtoTypeMapping<Key, Type> = {
  type: Key;
} & Type;

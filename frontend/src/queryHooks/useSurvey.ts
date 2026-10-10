import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AddTextDataPointRequest, CreateSurveyRequest } from "../api/data-contracts.ts";
import { Survey } from "../api/Survey.ts"

const surveyApi = new Survey({
    baseURL: "http://localhost:8080"
});

export function useSurveys() {
    return useQuery({
        queryKey: ["surveys"],
        queryFn: async () => {
            const r = await surveyApi.getAllSurvey();
            return r;
        }
    })
}

export function useSurvey(id: string) {
    return useQuery({
        queryKey: ["survey", id],
        queryFn: async () => {
            const r = await surveyApi.getSurvey(id);
            return r;
        }
    })
}

export function useAddDataPoint(surveyId: string) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (data: Omit<AddTextDataPointRequest, "surveyId">) => {
            const r = await surveyApi.addTextDatapoint({
                ...data,
                surveyId: surveyId
            });
            return r;
        },
        onSettled: async () => {
            await qc.invalidateQueries({
                queryKey: ["survey", surveyId],

            })
        }
    })
}

export function useCreateSurvey() {
    return useMutation({
        mutationFn: async (data: CreateSurveyRequest) => {
            const r = await surveyApi.createSurvey(data);
            return r;
        },
    })
}
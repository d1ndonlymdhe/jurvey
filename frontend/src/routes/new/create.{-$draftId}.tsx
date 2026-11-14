import { createFileRoute } from '@tanstack/react-router'
import { useAppDispatch, useAppSelector } from "@/src/hooks.ts";
import {
    DraftSurvey,
    fetchDetailedSurvey,
    NewDraftSelectDatapoint,
    NewDraftSurvey,
    NewDraftTextDataPoint,
    selectDraftSurveyWithId,
    type DraftDataPoint
} from "@/src/slices/draftSurveySlice.ts";
import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card.tsx";
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Field, FieldDescription, FieldLabel, FieldSet } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { FormProvider, useFieldArray, useForm, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Empty, EmptyHeader } from "@/components/ui/empty";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CheckFatIcon, SelectionAllIcon, TextAaIcon } from '@phosphor-icons/react';
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import type { DatapointDTO } from '@/src/api/data-contracts';
import { Label } from '@/components/ui/label';
export const Route = createFileRoute('/new/create/{-$draftId}')({
    component: RouteComponent,
})


function RouteComponent() {
    const { draftId } = Route.useParams();
    const dispatch = useAppDispatch()

    const selectedDraft = useAppSelector(state => selectDraftSurveyWithId(state, draftId || null))
    // const [draftSurveyEditCopy, setDraftSurveyEditCopy] = useState<DraftSurvey | undefined>(!draftId ? selectedDraft ? selectedDraft : NewDraftSurvey() : undefined)
    // const [draftSurveyOriginalCopy, setDraftSurveyOriginal] = useState<DraftSurvey | undefined>(draftSurveyEditCopy);

    const [isSurveyDetailsModalOpen, setIsSurveyDetailsModalOpen] = useState(false);
    const { reset, getValues, setValue, ...rest } = useForm<DraftSurvey>({
        defaultValues: NewDraftSurvey()
    })
    const [preview, _setDraftSurvey] = useState<DraftSurvey>(getValues())

    const savePreview = useCallback(() => {
        const preview = structuredClone(getValues());
        preview.questionCount = Object.keys(preview.dataPoints).length;
        _setDraftSurvey(preview)
    }, [getValues])

    useEffect(() => {
        if (draftId) {
            if (!selectedDraft) {
                void dispatch(fetchDetailedSurvey(draftId))
            }
            if (selectedDraft) {
                reset(selectedDraft)
                savePreview()
            }
        }
    }, [draftId, selectedDraft, getValues])

    const addQuestion = (type: DatapointDTO["type"]) => {
        const draftSurvey = getValues();
        console.log(draftSurvey)
        const newPosition = draftSurvey.questionCount;
        const label = `Question ${newPosition + 1}`
        const newDataPoint = type == "text" ? NewDraftTextDataPoint(label, draftSurvey.draftId, newPosition) : NewDraftSelectDatapoint(label, [], draftSurvey.draftId, newPosition);
        setValue("dataPoints", {
            ...draftSurvey.dataPoints,
            [newDataPoint.draftId]: newDataPoint
        })
        savePreview()
    }


    return <div className={"h-full w-full grid grid-cols-[1.5fr_7fr_1.5fr]"}>

        <div className={"h-full w-full bg-red-200"}>

        </div>
        <FormProvider {...{ reset, setValue, getValues, ...rest }}>

            <div className={"h-full w-full"}>
                <div className={"h-full w-full p-8 flex flex-col gap-4"}>
                    <Card>
                        <CardContent>
                            <div className={"flex flex-col gap-2"}>
                                <p className={"text-2xl font-bold hover:underline cursor-pointer"} onClick={() => setIsSurveyDetailsModalOpen(true)}>
                                    {
                                        preview.title ? preview.title : "Click to edit title"
                                    }
                                </p>
                                <p className={"text-lg  hover:underline cursor-pointer"} onClick={() => setIsSurveyDetailsModalOpen(true)}>
                                    {preview.description ? preview.description : "Click to edit description"}
                                </p>
                            </div>
                        </CardContent>
                        <SurveyDetailsModal
                            initValue={preview}
                            open={isSurveyDetailsModalOpen}
                            saveFn={savePreview}
                            setOpen={setIsSurveyDetailsModalOpen}
                        />
                    </Card>
                    {
                        preview.questionCount == 0 &&
                        <Card className={"ring-0 outline-2 outline-dashed"}>
                            <Empty>
                                <EmptyHeader>
                                    <p className={"text-2xl font-bold"}>
                                        No questions yet
                                    </p>
                                    <p className={"text-lg"}>
                                        Add questions to your survey to get started.
                                    </p>
                                </EmptyHeader>
                                <AddQuestionButton addQuestion={addQuestion} />
                            </Empty>
                        </Card>
                    }
                    {Object.values(preview.dataPoints).map(d => {
                        if (d.type === "text") {
                            return <EditTextDataPoint key={d.draftId} datapoint={d} saveFn={savePreview}></EditTextDataPoint>
                        } else {
                            return null;
                        }
                    })}
                </div>
            </div>
        </FormProvider>
        <div className={"h-full w-full bg-black"}>

        </div>
    </div>
}


type DiscriminatedDataPoint<T extends DraftDataPoint["type"]> = Extract<DraftDataPoint, { type: T }>

function EditTextDataPoint({ datapoint, saveFn }: { datapoint: DiscriminatedDataPoint<"text">, saveFn: () => void }) {
    const { register, setValue } = useFormContext<DraftSurvey>()
    const [editMode, setEditMode] = useState(false);
    return <Card className='px-4 py-2 focus-within:outline-2 focus-within:outline-black'>
        <div>
            <div className='grid grid-cols-[1fr_9fr] gap-2 items-center'>
                <div className='flex flex-row items-start justify-center gap-2'>
                    <div className='bg-zinc-200 rounded-md px-2 py-2'>
                        Q{datapoint.position + 1}
                    </div>
                    <div className='flex h-full px-2 py-2 items-center justify-center'>
                        <TextAaIcon size={20} />
                    </div>

                </div>
                <div className='w-full flex flex-row items-stretch'>
                    {
                        editMode ?
                            <Input {...register(`dataPoints.${datapoint.draftId}.label`)}></Input>
                            : <p className='flex-2'>{datapoint.label}</p>
                    }
                    <div className='flex flex-row gap-2'>
                        {
                            editMode ? <>
                                <button className='flex-1' onClick={() => {
                                    saveFn();
                                    setEditMode(false)
                                }}>Save</button>
                                <button className='flex-1' onClick={() => {
                                    setValue(`dataPoints.${datapoint.draftId}.label`, datapoint.label)
                                    setEditMode(false)
                                }}>Discard</button>
                            </> :
                                <button className='flex-1' onClick={() => { setEditMode(true) }}>Edit</button>
                        }
                    </div>
                </div>

            </div>
        </div>
    </Card>
}

function AddQuestionButton({
    addQuestion
}: {
    addQuestion: (questionType: DraftDataPoint["type"]) => void
}) {
    return <DropdownMenu>
        <DropdownMenuTrigger render={<Button>
            Add Question
        </Button>}>

        </DropdownMenuTrigger>
        <DropdownMenuContent align='center' className={"w-96"}>
            <DropdownMenuGroup>
                <DropdownMenuLabel>Question Type</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => addQuestion("text")}>
                    <Item>
                        <ItemMedia variant={"icon"}>
                            <TextAaIcon />
                        </ItemMedia>
                        <ItemContent>
                            <ItemTitle>Text Question</ItemTitle>
                            <ItemDescription>Free from text answer</ItemDescription>
                        </ItemContent>
                    </Item>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => addQuestion("select")}>
                    <Item>
                        <ItemMedia variant={"icon"}>
                            <CheckFatIcon />
                        </ItemMedia>
                        <ItemContent>
                            <ItemTitle>Selection Question</ItemTitle>
                            <ItemDescription>Select one from predefined options</ItemDescription>
                        </ItemContent>
                    </Item>
                </DropdownMenuItem>
            </DropdownMenuGroup>
        </DropdownMenuContent>
    </DropdownMenu>
}


function SurveyDetailsModal({
    initValue,
    saveFn,
    open,
    setOpen
}: {
    initValue: {
        name: string
        title: string
        description: string
    }
    saveFn: () => void,
    open: boolean,
    setOpen: (open: boolean) => void
}) {
    const { register } = useFormContext<DraftSurvey>()
    return <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className={"w-4xl"}>
            <DialogHeader>
                <p className={"text-2xl font-bold"}>
                    Survey Details
                </p>
            </DialogHeader>

            <div className={"flex flex-col gap-4"}>
                <Field>
                    <FieldLabel htmlFor="name">
                        Name
                    </FieldLabel>
                    <FieldDescription>
                        The internal name of the survey.
                    </FieldDescription>
                    <Input {...register("name")} defaultValue={initValue.name}></Input>
                </Field>
                <Field>
                    <FieldLabel htmlFor="title">
                        Title
                    </FieldLabel>
                    <FieldDescription>
                        The title of the survey, visible to the survey takers.
                    </FieldDescription>
                    <Input {...register("title")} defaultValue={initValue.description}></Input>
                </Field>
                <Field>
                    <FieldLabel htmlFor="description">
                        Description
                    </FieldLabel>
                    <FieldDescription>
                        A brief (optional) description of the survey.
                    </FieldDescription>
                    <Input {...register("description")} defaultValue={initValue.description}></Input>
                </Field>
                <Button type={"button"} onClick={() => {
                    saveFn()
                    setOpen(false)
                }}>Save</Button>
            </div>

        </DialogContent>
    </Dialog>
}

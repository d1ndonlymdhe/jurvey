import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useAppDispatch, useAppSelector } from "@/src/hooks.ts";
import {
    createFromDraft,
    DraftSurvey,
    editFromDraft,
    fetchDetailedSurvey,
    NewDraftSelectDatapoint,
    NewDraftSurvey,
    NewDraftTextDataPoint,
    saveDraftSurvey,
    selectDraftSurveyWithId,
    type DraftDataPoint
} from "@/src/slices/draftSurveySlice.ts";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card.tsx";
import { Dialog, DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { FormProvider, useFieldArray, useForm, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Empty, EmptyHeader } from "@/components/ui/empty";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { CheckFatIcon, TextAaIcon } from '@phosphor-icons/react';
import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';
import type { DatapointDTO } from '@/src/api/data-contracts';
import { RiRecordCircleLine } from '@remixicon/react';
import { DndContext } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { LoadingState } from '@/src/slices/surveysSlice';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export const Route = createFileRoute('/new/create/{-$draftId}')({
    component: RouteComponent,
})


function RouteComponent() {
    const { draftId } = Route.useParams();
    const dispatch = useAppDispatch()
    const navigate = useNavigate();



    const [isSurveyDetailsModalOpen, setIsSurveyDetailsModalOpen] = useState(false);
    const { control, reset, getValues, setValue, ...rest } = useForm<DraftSurvey>({
        defaultValues: NewDraftSurvey()
    })
    const selectedDraft = useAppSelector(state => selectDraftSurveyWithId(state, draftId || getValues("draftId")))
    const error = selectedDraft ? selectedDraft.syncErrorMsg : null;
    const submitLoading = selectedDraft ? selectedDraft.syncStatus == LoadingState.LOADING : false;
    const [preview, _setDraftSurvey] = useState<DraftSurvey>(getValues())


    const savePreview = useCallback(() => {
        const preview = structuredClone(getValues());
        preview.questionCount = Object.keys(preview.dataPoints).length;
        _setDraftSurvey(preview)
        dispatch(saveDraftSurvey(preview))
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
        const newPosition = Object.keys(draftSurvey.dataPoints).length;
        const label = `Question ${newPosition + 1}`
        const newDataPoint = type == "text" ? NewDraftTextDataPoint(label, draftSurvey.draftId, newPosition) : NewDraftSelectDatapoint(label, [], draftSurvey.draftId, newPosition);
        setValue("dataPoints", {
            ...draftSurvey.dataPoints,
            [newDataPoint.draftId]: newDataPoint
        })
        savePreview()
    }

    const deleteQuestion = (dataPointDraftId: string) => {
        const { dataPoints } = getValues();
        const deleted = dataPoints[dataPointDraftId];
        if (!deleted) return;
        const remaining: Record<string, DraftDataPoint> = {};
        Object.values(dataPoints).forEach((dp) => {
            if (dp.draftId === dataPointDraftId) return;
            // Close the gap left by the deleted question
            remaining[dp.draftId] = dp.position > deleted.position ? { ...dp, position: dp.position - 1 } : dp;
        })
        setValue("dataPoints", remaining)
        savePreview()
    }


    const submitDraft = () => {
        savePreview()
        const resolvedDraft = getValues();
        const saveFn = draftId ? editFromDraft : createFromDraft
        if (resolvedDraft) {
            void dispatch(saveFn(resolvedDraft)).unwrap().then(res => {
                void navigate({
                    to: "/survey/edit/$surveyId", params: {
                        surveyId: res.id
                    }
                })
            })
        }
    }

    return <div className={"h-full w-full grid grid-cols-[1.5fr_7fr_1.5fr]"}>

        <div className={"h-full w-full bg-red-200"}>

        </div>
        <FormProvider {...{ control, reset, setValue, getValues, ...rest }}>
            <div className={"h-full w-full"}>
                <div className={"h-full w-full p-8 flex flex-col gap-4"}>
                    <Card className="relative">
                        <CardContent>
                            <Button className={"absolute top-2 right-2"} disabled={submitLoading} onClick={() => { submitDraft() }}>
                                {
                                    submitLoading ? "Saving..." : "Save and Continue"
                                }
                            </Button>
                            <div className={"flex flex-col gap-2"}>
                                {
                                    error &&
                                    <Alert variant="destructive" className="max-w-md">
                                        <AlertTitle>Save failed</AlertTitle>
                                        <AlertDescription>
                                            {error}
                                        </AlertDescription>
                                    </Alert>
                                }
                                <p className={"text-2xl w-fit px-2 font-bold hover:underline cursor-pointer"} onClick={() => setIsSurveyDetailsModalOpen(true)}>
                                    {
                                        preview.title ? preview.title : "Click to edit title"
                                    }
                                </p>
                                <p className={"text-lg w-fit px-2 hover:underline cursor-pointer"} onClick={() => setIsSurveyDetailsModalOpen(true)}>
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
                    <DndContext onDragEnd={(dragEvent) => {
                        const active = dragEvent.active;
                        const over = dragEvent.over;
                        if (!over || active.id === over.id) return;
                        if (typeof active.id !== "string" || typeof over.id !== "string") return;
                        const currentDraftSurvey = getValues();
                        const oldDP = currentDraftSurvey?.dataPoints[active.id]

                        const newDP = currentDraftSurvey?.dataPoints[over.id];
                        if (oldDP == undefined || newDP == undefined) {
                            return;
                        }
                        const oldDpCopy = { ...oldDP };
                        const newDpCopy = { ...newDP };

                        const newDataPoints = {} as Record<string, DraftDataPoint>;

                        const dir = oldDpCopy.position < newDpCopy.position ? "down" : "up";
                        Object.values(currentDraftSurvey!.dataPoints).forEach((dp) => {
                            if (dp.draftId === oldDpCopy.draftId) {

                                newDataPoints[dp.draftId] = ({
                                    ...dp,
                                    position: newDpCopy.position
                                })
                            } else {
                                if (dir == "down") {

                                    if (dp.position <= newDpCopy.position) {
                                        newDataPoints[dp.draftId] = ({
                                            ...dp,
                                            position: dp.position - 1
                                        })
                                    } else {

                                        newDataPoints[dp.draftId] = dp;
                                    }
                                }
                                if (dir == "up") {
                                    if (dp.position >= newDpCopy.position) {
                                        newDataPoints[dp.draftId] = ({
                                            ...dp,
                                            position: dp.position + 1
                                        })
                                    } else {
                                        newDataPoints[dp.draftId] = dp;
                                    }
                                }
                            }
                        })
                        setValue("dataPoints", newDataPoints)
                        savePreview()
                    }}>
                        <SortableContext strategy={verticalListSortingStrategy} items={Object.values(preview.dataPoints).toSorted((a, b) => a.position - b.position).map(d => d.draftId)}>
                            {Object.values(preview.dataPoints).toSorted((a, b) => a.position - b.position).map(d => {
                                const deleteFn = () => deleteQuestion(d.draftId)
                                if (d.type === "text") {
                                    return <EditTextDataPoint key={d.draftId} datapoint={d} saveFn={savePreview} deleteFn={deleteFn}></EditTextDataPoint>
                                } else if (d.type === "select") {
                                    return <EditSelectDataPoint key={d.draftId} datapoint={d} saveFn={savePreview} deleteFn={deleteFn}></EditSelectDataPoint>;
                                }
                            })}
                        </SortableContext>
                    </DndContext>
                    {
                        preview.questionCount > 0 &&
                        <AddQuestionButton addQuestion={addQuestion} />
                    }

                </div>
            </div>
        </FormProvider>
        <div className={"h-full w-full bg-black"}>

        </div>
    </div>
}


type DiscriminatedDataPoint<T extends DraftDataPoint["type"]> = Extract<DraftDataPoint, { type: T }>

/**
 * Shared shell for every datapoint type: sortable card, drag handle, question number,
 * type icon, label editing and the Edit / Save / Discard / Delete controls.
 * Type-specific UI goes in `children`, which receives the current edit mode.
 * `onSave` / `onDiscard` run type-specific logic before the shell persists / resets the label.
 */
function DataPoint({
    datapoint,
    icon,
    saveFn,
    deleteFn,
    onSave,
    onDiscard,
    children,
}: {
    datapoint: DraftDataPoint,
    icon: ReactNode,
    saveFn: () => void,
    deleteFn: () => void,
    onSave?: () => void,
    onDiscard?: () => void,
    children?: (editMode: boolean) => ReactNode,
}) {
    const { register, setValue } = useFormContext<DraftSurvey>()
    const [editMode, setEditMode] = useState(false);
    const { attributes, listeners, transform, transition, setNodeRef } = useSortable({
        id: datapoint.draftId
    })

    const save = () => {
        onSave?.()
        saveFn()
        setEditMode(false)
    }

    const discard = () => {
        setValue(`dataPoints.${datapoint.draftId}.label`, datapoint.label)
        onDiscard?.()
        setEditMode(false)
    }

    return <Card className={`px-4 py-2 ${editMode ? "outline-2 outline-black" : ""}`} ref={setNodeRef}
        style={{
            transform: CSS.Translate.toString(transform),
            transition,
        }}>
        <div className='flex flex-col gap-2'>
            <div className='grid grid-cols-[1fr_9fr] gap-2 items-center'>
                <div className='flex flex-row items-start justify-center gap-2'>
                    <button className="cursor-grab active:cursor-grabbing px-2 py-2" {...attributes} {...listeners} style={{ touchAction: "none" }}>
                        ⠿
                    </button>
                    <div className='bg-zinc-200 rounded-md px-2 py-2'>
                        Q{datapoint.position + 1}
                    </div>
                    <div className='flex h-full px-2 py-2 items-center justify-center'>
                        {icon}
                    </div>
                </div>
                <div className='w-full flex flex-row items-stretch gap-4'>
                    {
                        editMode ?
                            <Input {...register(`dataPoints.${datapoint.draftId}.label`)} autoFocus></Input>
                            : <p className='flex-2'>{datapoint.label}</p>
                    }
                    <div className='flex flex-row gap-2'>
                        {
                            editMode ? <>
                                <button className='flex-1' onClick={save}>Save</button>
                                <button className='flex-1' onClick={discard}>Discard</button>
                                <button className='flex-1' onClick={deleteFn}>Delete</button>
                            </> :
                                <button className='flex-1' onClick={() => { setEditMode(true) }}>Edit</button>
                        }
                    </div>
                </div>
            </div>
            {children?.(editMode)}
        </div>
    </Card>
}

function EditTextDataPoint({ datapoint, saveFn, deleteFn }: { datapoint: DiscriminatedDataPoint<"text">, saveFn: () => void, deleteFn: () => void }) {
    return <DataPoint
        datapoint={datapoint}
        icon={<TextAaIcon size={20} />}
        saveFn={saveFn}
        deleteFn={deleteFn}
    />
}

function EditSelectDataPoint({ datapoint, saveFn, deleteFn }: { datapoint: DiscriminatedDataPoint<"select">, saveFn: () => void, deleteFn: () => void }) {
    const { setValue, getValues } = useFormContext<DraftSurvey>()
    const initialAllowedValuesWithRandId = datapoint.allowedValues.map((v) => ({
        value: v,
        id: crypto.randomUUID()
    }))
    const [internalDraftAllowedValues, setInternalDraftAllowedValues] = useState(initialAllowedValuesWithRandId);
    const { append, move, remove } = useFieldArray({
        name: `dataPoints.${datapoint.draftId}.allowedValues`
    })

    const onSave = () => {
        setInternalDraftAllowedValues(getValues(`dataPoints.${datapoint.draftId}.allowedValues`).map((v) => {
            return {
                value: v,
                id: crypto.randomUUID()
            }
        }))
    }

    const onDiscard = () => {
        setInternalDraftAllowedValues(initialAllowedValuesWithRandId)
        setValue(`dataPoints.${datapoint.draftId}.allowedValues`, datapoint.allowedValues)
    }

    return <DataPoint
        datapoint={datapoint}
        icon={<RiRecordCircleLine size={20} />}
        saveFn={saveFn}
        deleteFn={deleteFn}
        onSave={onSave}
        onDiscard={onDiscard}
    >
        {(editMode) => <>
            <DndContext
                onDragEnd={(dragEvent) => {
                    const active = dragEvent.active;
                    const over = dragEvent.over;
                    if (!over || active.id === over.id) return;
                    const oldIndex = internalDraftAllowedValues.findIndex((v) => v.id === active.id)
                    const newIndex = internalDraftAllowedValues.findIndex((v) => v.id === over.id)
                    if (oldIndex < 0 || newIndex < 0) return;
                    move(oldIndex, newIndex)
                    // Reorder internal list, keeping ids stable and values in sync with any unsaved edits in the form
                    const currentValues = getValues(`dataPoints.${datapoint.draftId}.allowedValues`)
                    const synced = internalDraftAllowedValues.map((v, i) => ({ ...v, value: currentValues[i] ?? v.value }))
                    setInternalDraftAllowedValues(arrayMove(synced, oldIndex, newIndex))
                }}
            >
                <SortableContext items={internalDraftAllowedValues}>
                    {
                        internalDraftAllowedValues.map((option, index) => {
                            return <SelectOptionEdit parentEditMode={editMode} key={option.id} option={option} index={index} datapointDraftId={datapoint.draftId} deleteFn={() => {
                                remove(index)
                                setInternalDraftAllowedValues([...internalDraftAllowedValues.slice(0, index), ...internalDraftAllowedValues.slice(index + 1)])
                            }}></SelectOptionEdit>
                        })
                    }
                </SortableContext>
            </DndContext>
            {
                editMode &&
                <Button onClick={() => {
                    append("New Option")
                    setInternalDraftAllowedValues([...internalDraftAllowedValues, { value: "New Option", id: crypto.randomUUID() }])
                }}>Add Option</Button>
            }
        </>}
    </DataPoint>
}


function SelectOptionEdit({
    option,
    datapointDraftId,
    index,
    deleteFn,
    parentEditMode
}: { option: { value: string, id: string }, index: number, datapointDraftId: string, deleteFn: () => void, parentEditMode: boolean }) {
    const { register, setValue } = useFormContext<DraftSurvey>()
    const { attributes, listeners, transform, transition, setNodeRef } = useSortable({
        id: option.id
    })

    const editMode = parentEditMode;
    const [hasChanged, setHasChanged] = useState(false);

    return <div className='w-full flex flex-row items-stretch justify-center gap-4 border-2 border-zinc-400 px-4 py-2 rounded-md' ref={setNodeRef}
        style={{
            transform: CSS.Transform.toString(transform),
            transition,
        }}>
        {
            editMode ? <button className="active:cursor-grabbing" {...attributes} {...listeners} style={{ touchAction: "none" }}>
                ⠿
            </button> : null
        }
        {!editMode && <div
            className='w-4 h-4 border border-black rounded-full'
        >
        </div>
        }
        {
            editMode ?
                <Input {...register(`dataPoints.${datapointDraftId}.allowedValues.${index}`, {
                    onChange: () => {
                        if (!hasChanged) {
                            setHasChanged(true)
                        }
                    }
                })} autoFocus></Input>
                : <p className='flex-2'>{option.value}</p>
        }
        <div className='flex flex-row gap-2'>
            {
                editMode ? <>
                    {
                        hasChanged &&
                        <button className='flex-1' onClick={() => {
                            setHasChanged(false)
                            setValue(`dataPoints.${datapointDraftId}.allowedValues.${index}`, option.value)
                        }}>Discard</button>
                    }
                    <button className='flex-1' onClick={() => { deleteFn() }}>Delete</button>
                </> : null
            }
        </div>
    </div >
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

import {createFileRoute} from '@tanstack/react-router'
import {useAddDataPoint, useSurvey} from "../../queryHooks/useSurvey.ts";
import {useState} from "react";

export const Route = createFileRoute('/survey/edit/$surveyId')({
    component: RouteComponent,
})

function RouteComponent() {
    const {surveyId} = Route.useParams();
    const {data: survey, isLoading: surveyLoading} = useSurvey(surveyId);
    if (surveyLoading) {
        return <div>Loading</div>
    }
    if (!survey) {
        return <div>Survey Not Found</div>
    }
    return <div>
        <h1>
            {survey.name}
        </h1>
        <ul>
            {
                survey.dataPoints?.map(d => {
                    return <div key={d.id}>
                        {d.label}
                    </div>
                })
            }
        </ul>
        <AddTextDataPoint surveyId={survey.id!}></AddTextDataPoint>
    </div>
}

function AddTextDataPoint({surveyId}: { surveyId: string }) {
    const {data: survey, isLoading: surveyLoading} = useSurvey(surveyId);
    const {mutate:addDataPoint } = useAddDataPoint(surveyId);

    const [label,setLabel] = useState("")

    if(surveyLoading){
        return "Loading"
    }

    if(!survey){
        return "Survey Not Found"
    }

    return <form onSubmit={(e)=>{e.preventDefault()}}>
        <input type={"text"} value={label} onChange={(e)=>{
            setLabel(e.target.value)
        }}/>
        <button onClick={()=>{
            addDataPoint({
                label
            })
        }}>
            Submit
        </button>
    </form>
}

import {createFileRoute, Link} from "@tanstack/react-router";
import {useSurveys} from "../queryHooks/useSurvey.ts";
export const Route = createFileRoute("/")({component: Index})

function Index() {
    const {data:surveyList,isLoading} = useSurveys();
    if (isLoading){
        return "LOADING";
    }
    if(!surveyList){
        return "NO SURVEY DATA";
    }
    return <>
        {
            surveyList.map(s=>{
                return <div key={s.id}>
                    <Link to={"/survey/edit/$surveyId"} params={{
                        surveyId:s.id!
                    }}>
                        <div>{s.id}</div>
                        <h1>{s.name}</h1>
                    </Link>
                </div>
            })

        }</>
}
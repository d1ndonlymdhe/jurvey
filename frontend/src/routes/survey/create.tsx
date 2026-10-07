import {createFileRoute, useNavigate} from '@tanstack/react-router'
import {useState} from "react";
import {useCreateSurvey} from "../../queryHooks/useSurvey.ts";

export const Route = createFileRoute('/survey/create')({
    component: RouteComponent,
})

function RouteComponent() {
    const [name, setName] = useState("");
    const {mutate:createSurvey} = useCreateSurvey();
    const navigate = useNavigate();
    return <div>
        <h1>Create Survey</h1>
        <form>
            <input type={"text"} value={name} onChange={(e) => {
                setName(e.target.value)
            }}/>
            <button type={"button"} onClick={() => {
                createSurvey(
                    {
                        name
                    },
                    {
                        onSuccess: async (d)=>{
                            await navigate({
                                to: "/survey/edit/$surveyId",
                                params: {
                                    surveyId: d.id!
                                }
                            })
                        }
                    }
                )
            }}>SAVE</button>

        </form>
    </div>
}

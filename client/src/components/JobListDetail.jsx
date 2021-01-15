import React, {useContext, useEffect} from 'react'
import { useHistory ,useParams} from "react-router-dom"
import ReactDOM from "react-dom";
import JobFinder from "../apis/JobFinder"
import { JobsContext } from '../context/JobContext'
import MDEditor from '@uiw/react-md-editor';

const JobListDetail = (props) => {
    const {jobs, setJobs} = useContext(JobsContext)
    const {id} = useParams();
    let history = useHistory()
    useEffect( () => {
        const fetchData = async () => {
            try {
                const response = await JobFinder.get("/");
                setJobs(response.data.data.jobs)
             } catch(err){
     
             }
        }
        fetchData();
    },[])

    

    const handleApplyRedirect = (e, id, link) => {
        e.stopPropagation()
        window.location.assign(link);
    };

    const handleJobSelect = (id) => {
        history.push(``)
    };

    return (
        <div className="list-group">
           <h2 class="col-4">Today's Product Jobs</h2><p class="col-4">(click each row to hide job description)</p>
            <table className="table"> 
                <tbody>
                    {jobs && jobs.sort((a,b) => a.id < b.id ? 1: -1).map(job => {
                        if(job.id === id){
                            return(
                                <>
                               <tr bgcolor={job.color} className="p-4"onClick={() => handleJobSelect(job.id)} key={job.id}>
                                        <td className="pl-5 pr-5">{job.name}</td>
                                        <td className="pl-5 pr-5">{job.location}</td>
                                        <td className="pl-5 pr-5">{job.primary_tag}</td>
                                        <td className="pl-5 pr-5"><button onClick={(e) => handleApplyRedirect(e,job.id,job.link)} className="btn btn-primary">Apply</button></td>
                                    </tr>
                            
                                <tr>
                                    <td colspan="999">
                                        <div className="row justify-content-center"><MDEditor.Markdown className="p-3" source={job.description}/>  
                                      <button onClick={(e) => handleApplyRedirect(e,job.id, job.link)} className=" btn btn-primary w-50 float">Apply for this position</button></div>
                                        
                                     
                                    
                                    </td>

                                </tr>
                                </>
                            );
                        }
                        else{
                            return(
                                <tr bgcolor={job.color} className="p-4"onClick={() => handleJobSelect(job.id)} key={job.id}>
                                        <td className="pl-5 pr-5">{job.name}</td>
                                        <td className="pl-5 pr-5">{job.location}</td>
                                        <td className="pl-5 pr-5">{job.primary_tag}</td>
                                        <td className="pl-5 pr-5"><button onClick={(e) => handleApplyRedirect(e,job.id,job.link)} className="btn btn-primary">Apply</button></td>
                                    </tr>
                                
                            );
                        }
                        
                        
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default JobListDetail

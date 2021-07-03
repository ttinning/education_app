import { useState, useEffect } from "react";
import TopicList from "../../components/parent/TopicList";
import TopicService from "../../services/TopicService";

const ParentDashboard = () => {
    
    const [topics, setTopics] = useState([])
    
    useEffect(() => {
        TopicService.getTopics()
            .then(result => setTopics(result))
    }, [])

    return (
        <section>
            <h2>This is the parent dashboard</h2>
            <TopicList topics={topics}></TopicList>
        </section>
    )
}

export default ParentDashboard;
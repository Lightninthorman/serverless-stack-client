import React, { useState } from "react";
import { Form } from "react-bootstrap";

export default function Search({ notes, searchResults, setSearchResults, allTags, ...props}){

    const [searchChoices, setSearchChoices] = useState([]);

    function handleSearch(event) {
        let searchChoice = event.target.value;
        let searchArray = [...searchChoices];
        let alreadySearched = searchArray.indexOf(searchChoice)

        if(alreadySearched === -1){
            searchArray.push(searchChoice);
            setSearchChoices(searchArray);

        }else{
            searchArray.splice(alreadySearched, 1);
            setSearchChoices(searchArray);

        }
        let noteMatches = notes.filter((note, i)=>{
            return searchArray.every(item => note.tags.includes(item));
        })

        setSearchResults(noteMatches);
    }

    return (
        <Form>
            <Form.Group controlId="tagSearch">
                <Form.Label>Search Tags</Form.Label>
                {allTags.map((tag, i)=>
                    tag === "- custom -" || tag === "" ? "":
                    <Form.Check
                    type="checkbox"
                    key={i}
                    id={tag}
                    value={tag}
                    label={tag}
                    onChange={handleSearch}
                    />

                )}
            </Form.Group>
        </Form>
    )
};

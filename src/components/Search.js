import React, { useState } from "react";
import { Form } from "react-bootstrap";
import "./Search.css";

export default function Search({ notes, searchTags, setSearchResults,  ...props}){

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

        if(!noteMatches[0]){
            noteMatches = [1]
        }

        setSearchResults(noteMatches);





    }

    return (
        <div className="searchContainer py-2 px-3 my-2">
            <Form>
                <Form.Group controlId="tagSearch">
                    <Form.Label>Search Tags</Form.Label>
                    <div className="d-flex flex-wrap">
                    {searchTags.map((tag, i)=>
                        tag === "- custom -" || tag === "" ? "":
                        <Form.Check
                        type="switch"
                        key={i}
                        id={tag}
                        value={tag}
                        label={tag}
                        className="mr-3 switch"
                        onChange={handleSearch}
                        />


                    )}
                    </div>
                </Form.Group>
            </Form>
        </div>
    )
};

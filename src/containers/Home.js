import React, { useState, useEffect } from "react";
// import { ListGroup, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { API } from "aws-amplify";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import "./Home.css";


export default function Home() {
  const [notes, setNotes] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);

  // let searchNotes = [...notes];


  useEffect(() => {
    async function onLoad() {
      if (!isAuthenticated) {
        return;
      }

      try {
        const notes = await loadNotes();
        setNotes(notes);

        const tagList = await createAllTags(notes);
        setAllTags(tagList);

      } catch (e) {
        onError(e);
      }
      setIsLoading(false);
      // console.log(allTags);
    }

    onLoad();
  }, [isAuthenticated]);

  function createAllTags(allNotes){
      let tagsArray = ["","- custom -","shopping", "groceries", "birthday"];
      let tagList =[];
      allNotes.map((note,i)=>{
      tagList = [...tagList, ...note.tags];
      // console.log("Here" ,note.tags);
     })
     // console.log(tagList);
     tagList = tagList.sort()
     tagsArray = [...tagsArray, ...tagList]
     // console.log(tagList);
      const removeDuplicates = new Set(tagsArray);
      const cleanTagsArray = [...removeDuplicates]
      // console.log(cleanTagsArray);
      return cleanTagsArray

  }

  function loadNotes() {
    return API.get("notes", "/notes");
  }

  function renderNotesList(notes) {
    return [{}].concat(notes).map((note, i) =>
      i !== 0 ? (
          <Link  to={{pathname:`/notes/${note.noteId}`, state:{allTags:allTags}}} key={note.noteId} className="note d-flex justify-content-between flex-column">
            <div>
                <h4>{note.content.trim().split("\n")[0]}</h4>
                <p>{"Created: " + new Date(note.createdAt).toLocaleString()}</p>
            </div>

            <div className="d-flex justify-content-start flex-wrap">
                {note.tags.map((tag, index)=>
                    tag ?
                    <p key={index} className="tag">{tag}</p>
                    :
                    ""
                )}
            </div>
          </Link>

      ) : (
            <Link to={{pathname:"/notes/new", state:{allTags:allTags}}} key="new"  className="create-note note">
            <h4>
              <b>{"\uFF0B"}</b> New Note
            </h4>
            </Link>

      )
    );
  }

  function renderLander() {
    return (
      <div className="lander">
        <h1>Scratch</h1>
        <p>A simple note taking app</p>
      </div>
    );
  }

  function renderNotes() {

    return (
      <div className="notes" >
        <h1 className="display-4">Your Notes</h1>
            <div className="notes-container ">
              {!isLoading && renderNotesList(notes)}
            </div>
      </div>
    );
  }

  return (
    <div className="Home">
      {isAuthenticated ? renderNotes() : renderLander()}
    </div>
  );
}

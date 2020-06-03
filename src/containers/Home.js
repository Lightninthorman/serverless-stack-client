import React, { useState, useEffect } from "react";
// import { ListGroup, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { API } from "aws-amplify";
import { useAppContext } from "../libs/contextLib";
import { onError } from "../libs/errorLib";
import  Search from "../components/Search"
import "./Home.css";


export default function Home() {
  const [notes, setNotes] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [searchTags, setSearchTags] = useState([])
  const [searchResults, setSearchResults] = useState([]);
  const { isAuthenticated } = useAppContext();
  const [isLoading, setIsLoading] = useState(true);
  const [showSearch, setShowSearch] = useState(true);





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

    }

    onLoad();
  }, [isAuthenticated]);

  function createAllTags(allNotes){
      let tagsArray = [];
      let tagList =["","- custom -"];
      allNotes.map((note,i)=>{
          return tagList = [...tagList, ...note.tags];
          // console.log("Here" ,note.tags);
     })
     // console.log(tagList);
     tagList = tagList.sort()
     tagsArray = [...tagsArray, ...tagList]
     if (tagList.every(tag => tag === "")) {
         setShowSearch(false);
     }else{
         setShowSearch(true);
     }
     // console.log(tagList);
      const removeDuplicates = new Set(tagsArray);
      const cleanTagsArray = [...removeDuplicates]
      setSearchTags(cleanTagsArray);
      // console.log(cleanTagsArray);
      return cleanTagsArray

  }

  function loadNotes() {
    return API.get("notes", "/notes");
  }

  function handleTagClick(e){
      e.preventDefault();
      let tagClicked = e.target.innerHTML;
      document.getElementById(tagClicked).click();
  }

  function renderNotesList(notes) {
      let noteData;
      if(searchResults[0]){
          noteData = searchResults;
          // console.log(searchResults);
      }else{
          noteData = notes;
      }

    return [{}].concat(noteData).map((note, i) =>
      i !== 0 ? (note === 1 ?
            <div key={i} className="no-results d-flex align-items-center">
                <h3>No Search Results Found</h3>
            </div>
            :
            <Link  to={{pathname:`/notes/${note.noteId}`, state:{allTags:allTags}}} key={note.noteId} className=" note d-flex justify-content-between flex-column">
                <div>
                    <h4>{note.content.trim().split("\n")[0]}</h4>
                    <p>{"Created: " + new Date(note.createdAt).toLocaleString()}</p>
                    </div>

                <div className="d-flex justify-content-start flex-wrap">
                    {note.tags.map((tag, index)=>
                        tag ?
                        <p key={index} className="tag" onClick={handleTagClick}>{tag}</p>
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
            {showSearch ? <Search notes={notes}
            searchTags={searchTags}
            setSearchResults={setSearchResults}
            allTags={allTags}
             />
             : ""
            }

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

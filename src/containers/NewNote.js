import React, { useRef, useState } from "react";
import { useHistory, Link, useLocation } from "react-router-dom";
import { onError } from "../libs/errorLib";
import { s3Upload } from "../libs/awsLib";
import { Form } from "react-bootstrap";
import { API } from "aws-amplify";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./NewNote.css";

export default function NewNote(props) {
  const file = useRef(null);
  const history = useHistory();
  const [content, setContent] = useState("");
  const [tags, setTags] = useState(["","",""]);
  const [tagChoice, setTagChoice] = useState(["","","",]);
  const [isLoading, setIsLoading] = useState(false);

  let location = useLocation();



   function validateForm() {
    return content.length > 0;
  }

  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }

    setIsLoading(true);

    try {
      const attachment = file.current ? await s3Upload(file.current) : null;

      await createNote({ content, attachment, tags });
      history.push("/");
    } catch (e) {
      onError(e);
      setIsLoading(false);
    }
  }


  function createNote(note) {
    return API.post("notes", "/notes", {
      body: note
    });
  }

  function tagYoureIt(e, index){
      let newTag = e.target.value;
      newTag = newTag.toLowerCase();
      // console.log("choice", newTag);
      let tagList = [...tagChoice]

      tagList[index] = newTag;
      // console.log("tag list", tagList);

      setTagChoice(tagList);

      if(newTag !== "- custom -"){
          let myTags = [...tags];
          myTags[index]= newTag
          setTags(myTags);
      }
  }

  function handleCustomTag(e,index){
       let newTag = e.target.value;
      let tagList = [...tags];
      tagList[index] = newTag.toLowerCase();
       // console.log(tagList);
      setTags(tagList);

  }



  return (
    <div className="NewNote">
      <form onSubmit={handleSubmit}>
        <Form.Group controlId="content">
          <Form.Control
            value={content}
            as="textarea"
            onChange={e => setContent(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="tags">
            <Form.Label>Tags</Form.Label>
        {tagChoice.map((tag, i) =>
            <div key={i} className="mb-2">
              <Form.Control as="select" value={tag} onChange={e => tagYoureIt(e,i)}>

                {
                    location.state.allTags.map((aTag,index)=>
                    <option key={index}>{aTag}</option>
                )
                }
              </Form.Control>
              {tagChoice[i] === "- custom -" ?
              <Form.Control type="text" autoFocus placeholder="enter new tag" onChange={e => handleCustomTag(e,i)} />
              : ""}
            </div>
            )
        }
        </Form.Group>
        <Form.Group controlId="file">
          <Form.Label>Attachment</Form.Label>
          <Form.Control onChange={handleFileChange} type="file" />
        </Form.Group>
          <div className="d-flex flex-column align-items-center">
            <LoaderButton
              block
              className="w-50"
              type="submit"
              size="lg"
              variant="primary"
              isLoading={isLoading}
              disabled={!validateForm()}
            >
              Create
            </LoaderButton>
            <Link to="/" className="btn btn-secondary w-50 mt-2">
                Cancel
            </Link>
          </div>
      </form>
    </div>
  );
}

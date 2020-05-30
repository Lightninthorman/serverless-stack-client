import React, { useRef, useState, useEffect } from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { API, Storage } from "aws-amplify";
import { s3Upload, s3Delete } from "../libs/awsLib";
import { onError } from "../libs/errorLib";
import { Form } from "react-bootstrap";
import LoaderButton from "../components/LoaderButton";
import config from "../config";
import "./Notes.css";

export default function Notes() {
    const file = useRef(null);
    const { id } = useParams();
    const history = useHistory();
    const [note, setNote] = useState(null);
    const [content, setContent] = useState("");
    const [tagChoice, setTagChoice] = useState(["","","",]);
    const [tags, setTags] = useState(["","",""])
    const [isLoading, setIsLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    let location = useLocation();

    useEffect(() => {
      function loadNote() {
        return API.get("notes", `/notes/${id}`);
      }

      async function onLoad() {
        try {
          const note = await loadNote();
          const { content, attachment, tags } = note;

          if (attachment) {
            note.attachmentURL = await Storage.vault.get(attachment);

          }

          setContent(content);
          setTagChoice(tags);
          setTags(tags);
          setNote(note);
        } catch (e) {
          onError(e);
        }
      }

      onLoad();
      console.log(tags);
    }, [id]);

    function validateForm() {
      return content.length > 0;
    }

    function formatFilename(str) {
      return str.replace(/^\w+-/, "");
    }

    function handleFileChange(event) {
      file.current = event.target.files[0];
    }

    function saveNote(note) {
      return API.put("notes", `/notes/${id}`, {
        body: note
      });
    }

    async function handleSubmit(event) {
      let attachment;

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
        if (file.current) {
          attachment = await s3Upload(file.current);

//***My own attempt at removing from s3, if there are issues this would be the best place to look first!!
            if(note.attachment){
                let deleted = await s3Delete(note.attachment);
                console.log(deleted);
            }

        }

        await saveNote({
          content,
          tags,
          attachment: attachment || note.attachment
        });
        history.push("/");
      } catch (e) {
        onError(e);
        setIsLoading(false);
      }
    }

    function deleteNote() {
      return API.del("notes", `/notes/${id}`);
    }

    async function handleDelete(event) {
      event.preventDefault();

      const confirmed = window.confirm(
        "Are you sure you want to delete this note?"
      );

      if (!confirmed) {
        return;
      }

      setIsDeleting(true);

      try {
        await deleteNote();

//*** Another spot where I may have broken the app
        if(note.attachment){
            let success = await s3Delete(note.attachment);
            console.log(success);
        }

        history.push("/");
      } catch (e) {
        onError(e);
        setIsDeleting(false);
      }
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
      <div className="Notes">
        {note && (
          <Form onSubmit={handleSubmit}>
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
                      {tagChoice[i] == "- custom -" ?
                      <Form.Control type="text" autoFocus placeholder="enter new tag" onChange={e => handleCustomTag(e,i)} />
                      : ""}
                    </div>
                    )
                }
            </Form.Group>
            {note.attachment && (
              <Form.Group>
                <Form.Label>Attachment</Form.Label>
                <Form.Text>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={note.attachmentURL}
                  >
                    {formatFilename(note.attachment)}
                  </a>
                </Form.Text>
              </Form.Group>
            )}
            <Form.Group controlId="file">
              {!note.attachment && <Form.Label>Attachment</Form.Label>}
              <Form.Control onChange={handleFileChange} type="file" />
            </Form.Group>
            <LoaderButton
              block
              type="submit"
              size="lg"
              variant="primary"
              isLoading={isLoading}
              disabled={!validateForm()}
            >
              Save
            </LoaderButton>
            <LoaderButton
              block
              size="lg"
              variant="danger"
              onClick={handleDelete}
              isLoading={isDeleting}
            >
              Delete
            </LoaderButton>
          </Form>
        )}
      </div>
    );
  }

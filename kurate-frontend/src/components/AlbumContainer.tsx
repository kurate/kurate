import React, { useState, useEffect } from "react";
import "./AlbumContainer.css";
import { chunk } from "lodash";
import {
  IonFab,
  IonFabButton,
  IonIcon,
  IonFabList,
  IonGrid,
  IonCol,
  IonRow,
  IonImg,
  IonModal,
  IonButton,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonTitle,
  IonCard,
  IonLoading,
  IonContent,
  IonCardContent,
  IonFooter,
} from "@ionic/react";
import { share, imageOutline, searchOutline } from "ionicons/icons";
import { Album } from "./ExploreContainer";
import { KURATE_API } from "../api";
import { KURATE_URLS } from "../url";

// TODO: Pass name
interface AlbumProps {
  _id: string;
}

const AlbumContainer: React.FC<AlbumProps> = (props: AlbumProps) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, isLoading] = useState(true);
  const [error, setError] = useState("");
  const [album, setAlbum] = useState<Album | undefined>();

  async function fetchAlbum() {
    await fetch(KURATE_API.Album(props._id))
      .then((res) => {
        if (!res.ok) {
          console.log("NOK: " + res);
        }
        return res.json();
      })
      .then((res) => {
        setAlbum(res);
        isLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setError("Can't fetch.");
        isLoading(false);
      });
  }

  useEffect(() => {
    fetchAlbum();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props._id]);

  // TODO: Use loading state instead
  if (loading) {
    return (
      <IonLoading isOpen={loading} message={"Please wait..."} duration={5000} />
    );
  }

  // TODO: ERROR STUFF (TOAST)
  if (error) {
    return (
      <>
        <h2>Error when fetching</h2>
      </>
    );
  }

  if (album == null) {
    return (
      <>
        <h2>Error album null</h2>
      </>
    );
  }

  const chunked = chunk(album.photos, 2);

  const rows = chunked.map((chunk) => {
    return (
      <IonRow>
        {chunk.map((photo) => {
          return (
            <IonCol>
              <IonCard routerLink={KURATE_URLS.Image(photo._id)}>
                {/* TODO: CHECK THUMBNAILS NULL OR EMPTY */}
                <IonImg src={KURATE_API.ImageUrl(photo.url)} />
              </IonCard>
            </IonCol>
          );
        })}
      </IonRow>
    );
  });

  return (
    <>
      {album.photos == null || album.photos.length < 1 ? (
        <div style={{ margin: "10px" }}>
          <IonCard>
            <IonCardContent>
              <h2>This album does not contain any photos yet.</h2>
              <IonButton onClick={() => setShowModal(true)}>
                <IonIcon slot='start' icon={share} />
                Upload something
              </IonButton>
            </IonCardContent>
          </IonCard>
        </div>
      ) : (
        <IonGrid>{rows}</IonGrid>
      )}

      <IonFab vertical='bottom' horizontal='end' slot='fixed'>
        <IonFabButton>
          <IonIcon icon={share} />
        </IonFabButton>
        <IonFabList side='start'>
          {/* <IonFabButton>
            <IonIcon icon={albumsOutline} onClick={() => setShowModal(true)} />
          </IonFabButton> */}
          <IonFabButton>
            <IonIcon icon={imageOutline} onClick={() => setShowModal(true)} />
          </IonFabButton>
          <IonFabButton onClick={() => setShowModal(true)}>
            <IonIcon icon={searchOutline} />
          </IonFabButton>
        </IonFabList>
      </IonFab>

      <UploadImageModal
        album={album}
        showModal={showModal}
        onClose={() => {
          setShowModal(false);
          fetchAlbum();
        }}
      />
    </>
  );
};

export const UploadImageModal = (props: {
  showModal: boolean;
  album: Album;
  onClose: () => void;
}) => {
  // Files for desktop
  const [files, setFiles] = useState<File[]>([]);

  // TODO: Fix capacitor camera input (Or drop it if we're fine with form input)
  // For app / capacitor camera input
  const [pictures] = useState([]);

  const handleSubmit = (event: any) => {
    event.preventDefault();
    props.onClose();

    console.log(`Submitting`);
    console.log(files);
    console.log(pictures);

    postImagesToAlbum(files);
  };

  async function postImagesToAlbum(_files: File[]) {
    const formData = new FormData();

    files.forEach((f) => {
      formData.append(f.name, f);
    });

    console.log(props.album);

    await fetch(KURATE_API.Album(props.album._id), {
      method: "POST",
      body: formData,
    });

    setFiles([]);
  }

  return (
    <IonModal
      isOpen={props.showModal}
      swipeToClose={true}
      onDidDismiss={props.onClose}
      cssClass='upload-modal'
    >
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>Upload photos</IonTitle>
          <IonButtons slot='end'>
            <IonButton onClick={props.onClose}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <form onSubmit={handleSubmit}>
        <>
          <IonContent className='upload-modal-content'>
            <label className='custom-file-upload' htmlFor='file-upload'>
              <IonCard>
                <IonCardContent>Add images...</IonCardContent>
              </IonCard>
            </label>
            <input
              id='file-upload'
              type='file'
              name='image'
              accept='image/*'
              multiple
              style={{ display: "none" }}
              onChange={(e) => {
                if (e.target.files && e.target.files != null) {
                  setFiles(files.concat(Array.from(e.target.files)));
                } else {
                  console.log("file error");
                }
              }}
            />

            {/* Show the uploaded pictures here */}
            {files.map((pic, index) => {
              return (
                <IonCard key={index}>
                  <IonImg src={URL.createObjectURL(pic)} />
                </IonCard>
              );
            })}
          </IonContent>
          <IonFooter>
            <IonToolbar>
              <div className='upload-modal-footer'>
                <IonButton expand='block' type='submit'>
                  Upload {files.length} images
                </IonButton>
              </div>
            </IonToolbar>
          </IonFooter>
        </>
      </form>
    </IonModal>
  );
};

export default AlbumContainer;

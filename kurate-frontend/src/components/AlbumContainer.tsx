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
  IonInput,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
} from "@ionic/react";
import {
  share,
  imageOutline,
  searchOutline,
  albumsOutline,
} from "ionicons/icons";
import { KURATE_URLS } from "../url";
import { Album } from "./ExploreContainer";
import { KURATE_API } from "../api";

// TODO: Pass name
interface AlbumProps {
  _id: string;
}

const AlbumContainer: React.FC<AlbumProps> = (props: AlbumProps) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, isLoading] = useState(true);
  const [error, setError] = useState("");
  const [album, setAlbum] = useState<Album | undefined>();

  useEffect(() => {
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

    fetchAlbum();
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

  const rows = chunked.map((chunk, index) => {
    return (
      <IonRow>
        {chunk.map((photo, index) => {
          return (
            <IonCol>
              <IonCard routerLink={KURATE_URLS.Home}>
                {/* TODO: CHECK THUMBNAILS NULL OR EMPTY */}
                <IonImg src={KURATE_API.Image(photo.thumbnails[1].uri)} />
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
        <h2>No photos yet.</h2>
      ) : (
        <IonGrid>{rows}</IonGrid>
      )}

      <IonFab vertical='bottom' horizontal='end' slot='fixed'>
        <IonFabButton>
          <IonIcon icon={share} />
        </IonFabButton>
        <IonFabList side='start'>
          <IonFabButton>
            <IonIcon icon={albumsOutline} onClick={() => setShowModal(true)} />
          </IonFabButton>
          <IonFabButton>
            <IonIcon icon={imageOutline} onClick={() => setShowModal(true)} />
          </IonFabButton>
          <IonFabButton onClick={() => setShowModal(true)}>
            <IonIcon icon={searchOutline} />
          </IonFabButton>
        </IonFabList>
      </IonFab>

      <UploadAlbumModal
        showModal={showModal}
        onClose={() => {
          setShowModal(false);
        }}
      />
    </>
  );
};

export const UploadAlbumModal = (props: {
  showModal: boolean;
  onClose: () => void;
}) => {
  const [name, setName] = useState("");

  const handleSubmit = (event: any) => {
    event.preventDefault();
    props.onClose();

    console.log(`Submitting Name ${name}`);
    postNewAlbum();
  };

  async function postNewAlbum() {
    await fetch(KURATE_API.AlbumList, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });
  }

  return (
    <IonModal
      isOpen={props.showModal}
      swipeToClose={true}
      onDidDismiss={props.onClose}
    >
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>Upload new photo</IonTitle>
          <IonButtons slot='end'>
            <IonButton onClick={props.onClose}>Close</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <form onSubmit={handleSubmit}>
          <IonList>
            <IonItem>
              <IonLabel position='floating'>Name</IonLabel>
              <IonInput
                value={name}
                placeholder='Enter Input'
                onIonChange={(e) => setName(e.detail.value!)}
                clearInput
              ></IonInput>
            </IonItem>
          </IonList>
          <IonButton expand='block' type='submit'>
            Create album
          </IonButton>
        </form>
      </IonContent>
    </IonModal>
  );
};

export default AlbumContainer;

import React, { useState, useEffect } from "react";
import "./AlbumContainer.css";
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
  IonToast,
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
  });

  // TODO: Use loading state instead
  if (loading) {
    return (
      <IonLoading isOpen={loading} message={"Please wait..."} duration={5000} />
    );
  }

  // TODO: ERROR STUFF
  if (error != null) {
    return (
      <>
        <h2>Error</h2>
        <IonToast isOpen={true} message={error} />
      </>
    );
  }
  if (album == null) {
    return (
      <>
        <h2>Error</h2>
        <IonToast isOpen={true} message={"Error fetching"} />
      </>
    );
  }

  return (
    <div id='single-album-content'>
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonCard routerLink={KURATE_URLS.Home}>
              <IonImg src={album.photos[0].uri} />
            </IonCard>
          </IonCol>
          <IonCol>
            <IonCard routerLink={KURATE_URLS.Home}>
              <IonImg src={album.photos[1].uri} />
            </IonCard>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonCard routerLink={KURATE_URLS.Home}>
              <IonImg src={album.photos[2].uri} />
            </IonCard>
          </IonCol>
          <IonCol>
            <IonCard routerLink={KURATE_URLS.Home}>
              <IonImg src={album.photos[3].uri} />
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>

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

      <IonModal
        isOpen={showModal}
        swipeToClose={true}
        onDidDismiss={() => setShowModal(false)}
      >
        <IonHeader translucent>
          <IonToolbar>
            <IonTitle>Upload something</IonTitle>
            <IonButtons slot='end'>
              <IonButton onClick={() => setShowModal(false)}>Close</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonButton onClick={() => setShowModal(false)}>Close Modal</IonButton>
      </IonModal>
    </div>
  );
};

export default AlbumContainer;

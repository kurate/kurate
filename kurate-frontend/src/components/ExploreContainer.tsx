import React, { useState, useEffect } from "react";
import "./ExploreContainer.css";
import {
  IonFab,
  IonFabButton,
  IonIcon,
  IonFabList,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
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
import { KURATE_API } from "../api";

interface ContainerProps {
  name: string;
}

export interface Album {
  _id: string;
  name: string;
  photos: Photo[];
  date: string;
}

export interface Photo {
  _id: string;
  file_name: string;
  uri: string;
  thumbnails: Thumbnail[];
}

export interface Thumbnail {
  size: string;
  dimension: number;
  uri: string;
}

export enum Size {
  TINY = "TINY",
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
}

const ExploreContainer: React.FC<ContainerProps> = () => {
  const [showModal, setShowModal] = useState(false);
  const [loading, isLoading] = useState(true);
  const [error, setError] = useState("");
  const [albums, setAlbums] = useState<Album[] | undefined>();

  useEffect(() => {
    async function fetchAlbums() {
      await fetch(KURATE_API.AlbumList)
        .then((res) => {
          if (!res.ok) {
            console.log("NOK: " + res);
          }
          return res.json();
        })
        .then((res) => {
          setAlbums(res);
          isLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setError("Can't fetch.");
          isLoading(false);
        });
    }

    fetchAlbums();
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
  if (albums == null) {
    return (
      <>
        <h2>Error</h2>
        <IonToast isOpen={true} message={"Error fetching"} />
      </>
    );
  }

  // TODO: Allow configureable multi column layout
  const albumCards = albums.map((item, index) => {
    return (
      <IonRow key={index}>
        <IonCol>
          <IonCard routerLink={KURATE_URLS.Album(item._id)}>
            <IonImg
              src={item.photos[0].uri}
              onIonError={(e) => console.log(e)}
              onIonImgDidLoad={(e) => console.log(e)}
            />
            <IonCardHeader>
              <IonCardSubtitle>
                From {new Date(item.date).toLocaleDateString()}
              </IonCardSubtitle>
              <IonCardTitle>{item.name}</IonCardTitle>
            </IonCardHeader>
          </IonCard>
        </IonCol>
      </IonRow>
    );
  });

  return (
    <div id='albums-content'>
      <IonGrid>{albumCards}</IonGrid>

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

export default ExploreContainer;

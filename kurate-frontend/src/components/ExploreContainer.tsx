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
  IonInput,
  IonList,
  IonItem,
  IonContent,
  IonLabel,
  IonSkeletonText,
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
        console.log("Fetch error: " + err);
        setError("Can't fetch.");
        isLoading(false);
      });
  }

  useEffect(() => {
    fetchAlbums();
  }, []);

  // TODO: Use loading state instead
  if (loading) {
    return (
      <IonLoading isOpen={loading} message={"Please wait..."} duration={5000} />
    );
  }

  // TODO: ERROR STUFF
  if (error) {
    return (
      <>
        <h2>Error when fetching</h2>
      </>
    );
  }
  if (albums == null) {
    return (
      <>
        <h2>Error album null</h2>
      </>
    );
  }

  // TODO: Allow configureable multi column layout
  const albumCards = albums.map((item, index) => {
    return (
      <IonRow key={index}>
        <IonCol>
          <IonCard routerLink={KURATE_URLS.Album(item._id)}>
            {item.photos != null && item.photos[0] != null ? (
              // TODO: Use animated skeleton below as loading indicator
              // TODO: CHECK THUMBNAILS NULL OR EMPTY
              <IonImg
                src={KURATE_API.Image(item.photos[0].uri)}
                onIonImgDidLoad={(e) => {
                  console.log(e);
                }}
              />
            ) : (
              // Empty image placeholder
              <IonSkeletonText style={{ height: "200px", margin: 0 }} />
            )}
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
    <>
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

      <UploadAlbumModal
        showModal={showModal}
        onClose={() => {
          setShowModal(false);
          fetchAlbums();
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

  // TODO: Use the response instead of just refetching after posting
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
          <IonTitle>Create a new album</IonTitle>
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

export default ExploreContainer;

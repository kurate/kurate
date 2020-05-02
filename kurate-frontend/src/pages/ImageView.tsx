import {
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonImg,
  IonLoading,
} from "@ionic/react";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { KURATE_API } from "../api";
import { Photo } from "../components/ExploreContainer";

const ImageView: React.FC = () => {
  const { uri } = useParams<{ uri: string }>();

  const [loading, isLoading] = useState(true);
  const [error, setError] = useState("");
  const [photo, setPhoto] = useState<Photo | undefined>();

  async function fetchAlbum() {
    await fetch(KURATE_API.Image(uri))
      .then((res) => {
        if (!res.ok) {
          console.log("NOK: " + res);
        }
        return res.json();
      })
      .then((res) => {
        setPhoto(res);
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
  }, [uri]);

  // TODO: Use loading state instead
  if (loading) {
    return (
      <IonLoading isOpen={loading} message={"Please wait..."} duration={5000} />
    );
  }

  if (error) {
    return (
      <>
        <h2>Error when fetching</h2>
      </>
    );
  }

  if (photo == null) {
    return (
      <>
        <h2>Error photo null</h2>
      </>
    );
  }

  console.log(photo);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonBackButton />
          </IonButtons>
          <IonTitle>View Image</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse='condense'>
          <IonToolbar>
            <IonTitle size='large'>{uri}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonImg src={KURATE_API.ImageUrl(photo.url)} />
        {/* TODO: */}
      </IonContent>
    </IonPage>
  );
};

export default ImageView;

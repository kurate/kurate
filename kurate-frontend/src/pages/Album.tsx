import {
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBackButton,
} from "@ionic/react";
import React from "react";
import "./Album.css";
import { useParams } from "react-router";
import AlbumContainer from "../components/AlbumContainer";

const Album: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonBackButton />
          </IonButtons>
          <IonTitle>{id}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse='condense'>
          <IonToolbar>
            <IonTitle size='large'>{id}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <AlbumContainer _id={id} />
      </IonContent>
    </IonPage>
  );
};

export default Album;

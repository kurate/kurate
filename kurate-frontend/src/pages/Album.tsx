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
        <h1>TODO: Put content of album with id {id}</h1>
      </IonContent>
    </IonPage>
  );
};

export default Album;

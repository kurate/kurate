import {
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonBackButton,
  IonImg,
} from "@ionic/react";
import React from "react";
import { useParams } from "react-router";
import { KURATE_API } from "../api";

const ImageView: React.FC = () => {
  const { uri } = useParams<{ albumid: string; uri: string }>();

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
        <IonImg src={KURATE_API.Image(uri)} />
        {/* TODO: */}
      </IonContent>
    </IonPage>
  );
};

export default ImageView;

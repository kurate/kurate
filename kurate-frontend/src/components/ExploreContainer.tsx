import React, { useState } from "react";
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
} from "@ionic/react";
import {
  share,
  imageOutline,
  searchOutline,
  albumsOutline,
} from "ionicons/icons";
import { KURATE_URLS } from "../url";

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

// TODO: TEST DATA, FETCH FROM BACKEND INSTEAD
const items: Album[] = [
  {
    _id: "id1",
    name: "A day in the sky",
    photos: [
      {
        _id: "photo1",
        file_name: "cool.png",
        uri:
          "https://images.pexels.com/photos/682406/pexels-photo-682406.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        thumbnails: [
          {
            size: Size.MEDIUM,
            dimension: 256,
            uri:
              "https://images.pexels.com/photos/682406/pexels-photo-682406.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
          },
        ],
      },
      {
        _id: "photo2",
        file_name: "cool.png",
        uri:
          "https://images.pexels.com/photos/3584430/pexels-photo-3584430.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        thumbnails: [
          {
            size: Size.MEDIUM,
            dimension: 256,
            uri:
              "https://images.pexels.com/photos/3584430/pexels-photo-3584430.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
          },
        ],
      },
      {
        _id: "photo3",
        file_name: "cool.png",
        uri:
          "https://images.pexels.com/photos/1420701/pexels-photo-1420701.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        thumbnails: [
          {
            size: Size.MEDIUM,
            dimension: 256,
            uri:
              "https://images.pexels.com/photos/1420701/pexels-photo-1420701.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
          },
        ],
      },
      {
        _id: "photo4",
        file_name: "cool.png",
        uri:
          "https://images.pexels.com/photos/3820994/pexels-photo-3820994.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        thumbnails: [
          {
            size: Size.MEDIUM,
            dimension: 256,
            uri:
              "https://images.pexels.com/photos/3820994/pexels-photo-3820994.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
          },
        ],
      },
    ],
    date: "2020-01-01",
  },
  {
    _id: "id2",
    name: "A hoe in the garden",
    photos: [
      {
        _id: "photo2",
        file_name: "cool.png",
        uri:
          "https://images.pexels.com/photos/3584430/pexels-photo-3584430.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        thumbnails: [
          {
            size: Size.MEDIUM,
            dimension: 256,
            uri:
              "https://images.pexels.com/photos/3584430/pexels-photo-3584430.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
          },
        ],
      },
    ],
    date: "2020-01-01",
  },
  {
    _id: "id3",
    name: "A walk in the park",
    photos: [
      {
        _id: "photo3",
        file_name: "cool.png",
        uri:
          "https://images.pexels.com/photos/1420701/pexels-photo-1420701.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
        thumbnails: [
          {
            size: Size.MEDIUM,
            dimension: 256,
            uri:
              "https://images.pexels.com/photos/1420701/pexels-photo-1420701.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
          },
        ],
      },
    ],
    date: "2020-01-01",
  },
  {
    _id: "id4",
    name: "A walk in the park",
    photos: [
      {
        _id: "photo4",
        file_name: "cool.png",
        uri:
          "https://images.pexels.com/photos/3820994/pexels-photo-3820994.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
        thumbnails: [
          {
            size: Size.MEDIUM,
            dimension: 256,
            uri:
              "https://images.pexels.com/photos/3820994/pexels-photo-3820994.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
          },
        ],
      },
    ],
    date: "2020-01-01",
  },
];

const ExploreContainer: React.FC<ContainerProps> = () => {
  const [showModal, setShowModal] = useState(false);

  // TODO: Allow configureable multi column layout
  const albums = items.map((item, index) => {
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
      <IonGrid>{albums}</IonGrid>

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

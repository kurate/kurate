import React, { useState } from "react";
import "./AlbumContainer.css";
import {
  IonFab,
  IonFabButton,
  IonIcon,
  IonFabList,
  IonContent,
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

// TODO: TEST DATA, FETCH FROM BACKEND INSTEAD
const items = [
  {
    id: "id1",
    name: "A day in the sky",
    src:
      "https://images.pexels.com/photos/682406/pexels-photo-682406.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    date: new Date("2020-01-01"),
  },
  {
    id: "id2",
    name: "A hoe in the garden",
    src:
      "https://images.pexels.com/photos/3584430/pexels-photo-3584430.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    date: new Date("2020-01-01"),
  },
  {
    id: "id3",
    name: "A walk in the park",
    src:
      "https://images.pexels.com/photos/1420701/pexels-photo-1420701.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    date: new Date("2020-01-01"),
  },
  {
    id: "id4",
    name: "A walk in the park",
    src:
      "https://images.pexels.com/photos/3820994/pexels-photo-3820994.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260",
    date: new Date("2020-01-01"),
  },
  {
    id: "id5",
    name: "A walk in the park",
    src:
      "https://images.pexels.com/photos/1040161/pexels-photo-1040161.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    date: new Date("2020-01-01"),
  },
];

const AlbumContainer: React.FC<ContainerProps> = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <IonContent id='single-album-content' fullscreen>
      <IonGrid>
        <IonRow>
          <IonCol>
            <IonCard routerLink={KURATE_URLS.Home}>
              <IonImg src={items[0].src} />
            </IonCard>
          </IonCol>
          <IonCol>
            <IonCard routerLink={KURATE_URLS.Home}>
              <IonImg src={items[1].src} />
            </IonCard>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonCard routerLink={KURATE_URLS.Home}>
              <IonImg src={items[2].src} />
            </IonCard>
          </IonCol>
          <IonCol>
            <IonCard routerLink={KURATE_URLS.Home}>
              <IonImg src={items[3].src} />
            </IonCard>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonCard routerLink={KURATE_URLS.Home}>
              <IonImg src={items[0].src} />
            </IonCard>
          </IonCol>
          <IonCol>
            <IonCard routerLink={KURATE_URLS.Home}>
              <IonImg src={items[1].src} />
            </IonCard>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonCard routerLink={KURATE_URLS.Home}>
              <IonImg src={items[2].src} />
            </IonCard>
          </IonCol>
          <IonCol>
            <IonCard routerLink={KURATE_URLS.Home}>
              <IonImg src={items[3].src} />
            </IonCard>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonCard routerLink={KURATE_URLS.Home}>
              <IonImg src={items[0].src} />
            </IonCard>
          </IonCol>
          <IonCol>
            <IonCard routerLink={KURATE_URLS.Home}>
              <IonImg src={items[1].src} />
            </IonCard>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonCard routerLink={KURATE_URLS.Home}>
              <IonImg src={items[2].src} />
            </IonCard>
          </IonCol>
          <IonCol>
            <IonCard routerLink={KURATE_URLS.Home}>
              <IonImg src={items[3].src} />
            </IonCard>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonCard routerLink={KURATE_URLS.Home}>
              <IonImg src={items[0].src} />
            </IonCard>
          </IonCol>
          <IonCol>
            <IonCard routerLink={KURATE_URLS.Home}>
              <IonImg src={items[1].src} />
            </IonCard>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonCard routerLink={KURATE_URLS.Home}>
              <IonImg src={items[2].src} />
            </IonCard>
          </IonCol>
          <IonCol>
            <IonCard routerLink={KURATE_URLS.Home}>
              <IonImg src={items[3].src} />
            </IonCard>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonCard routerLink={KURATE_URLS.Home}>
              <IonImg src={items[0].src} />
            </IonCard>
          </IonCol>
          <IonCol>
            <IonCard routerLink={KURATE_URLS.Home}>
              <IonImg src={items[1].src} />
            </IonCard>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonCard routerLink={KURATE_URLS.Home}>
              <IonImg src={items[2].src} />
            </IonCard>
          </IonCol>
          <IonCol>
            <IonCard routerLink={KURATE_URLS.Home}>
              <IonImg src={items[4].src} />
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
    </IonContent>
  );
};

export default AlbumContainer;

import { IonItem,IonLabel } from "@ionic/react";
import React from "react";
import { Vehicle } from "../../models/Vehicle";

interface VehicleListItemProps {
    vehicle: Vehicle
}

const VehiclesListItem: React.FC<VehicleListItemProps> = ({vehicle}) => {
    return (
        <IonItem routerLink={`/tabs/vehicles/${vehicle.id}`}>
            <IonLabel>
                <h3>Vehicule#{vehicle.id}</h3>
                <p><strong>Immatriculation: </strong>{vehicle.licensePlate}</p>
            </IonLabel>
        </IonItem>
    )
}

export default React.memo(VehiclesListItem); 
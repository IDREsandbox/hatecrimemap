import axios from 'axios';
import React from 'react';

export function createDataToSubmit(formData) { // NEEDED
    const {
        targetCategory,
        groups,
        primaryGroup,
        groupsChecked,
        groupsExpanded,
        latLng,
        location,
        sourceurl,
        other_race,
        other_religion,
        other_gender,
        other_misc,
        date,
        description
    } = formData;
    return ({
        lat: latLng.lat,
        lon: latLng.lng,
        location: location,
        incidentdate: date,
        sourceurl: sourceurl,
        primaryGroup: primaryGroup,
        groups: groupsChecked,
        other_race: other_race,
        other_religion: other_religion,
        other_gender: other_gender,
        other_misc: other_misc,
        description: description
    });
}

export const reviewIncidentReport = (id, verified, callback = () => {}) => {
    axios.post('/api/verify/reviewedincident', { id, verified })
        .then(res => {
            callback();
            window.location.reload();
        })
        .catch(err => console.log(err));
};

export const validateIncidentReport = (id, urlvalid, callback = () => {}) => {
    axios.post('/api/verify/validateincident', { id, urlvalid })
        .then(res => {
            callback();
            window.location.reload();
        })
        .catch(err => console.log(err));
};

export const publishedIncidentReport = (id, published, callback = () => {}) => {
    axios.post('/api/verify/publishedincident', { id, published })
        .then(res => {
            callback();
            window.location.reload();
        })
        .catch(err => console.log(err));
};

export const deleteIncidentReport = (id, callback = () => {}) => {
    console.log(id);
    axios.delete(`/api/verify/incidentreport/${id}`)
        .then(res => console.log(res.data))
        .catch(err => console.log(err));
    callback();
    window.location.reload();
};
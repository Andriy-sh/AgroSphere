import { useState, useEffect } from 'react';
import { ClientData } from '@@agrosphere/shared';
import { getConsultantValue } from '../utils/consultant-utils';
import { getTagValues } from '../utils/tag-utils';

export function useClientForm(client: ClientData) {
  const [firstName, setFirstName] = useState(client.name.split(' ')[0]);
  const [lastName, setLastName] = useState(client.name.split(' ')[1]);
  const [addressLine1, setAddressLine1] = useState(client.address);
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [county, setCounty] = useState('');
  const [country, setCountry] = useState('ireland');
  const [eircode, setEircode] = useState('');
  const [postcode, setPostcode] = useState('');
  const [phone, setPhone] = useState(client.phone);
  const [email, setEmail] = useState(client.email);
  const [herdNo, setHerdNo] = useState(client.herdNo);
  const [farmType, setFarmType] = useState('dairy');
  const [assignedConsultant, setConsultant] = useState(
    getConsultantValue(client.assignedConsultant)
  );
  const [tags, setTags] = useState<string[]>(getTagValues(client.tags));

  useEffect(() => {
    setFirstName(client.name.split(' ')[0]);
    setLastName(client.name.split(' ')[1]);
    setAddressLine1(client.address);
    setPhone(client.phone);
    setEmail(client.email);
    setHerdNo(client.herdNo);
    setConsultant(getConsultantValue(client.assignedConsultant));
    setTags(getTagValues(client.tags));
  }, [client]);

  return {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    addressLine1,
    setAddressLine1,
    addressLine2,
    setAddressLine2,
    city,
    setCity,
    county,
    setCounty,
    country,
    setCountry,
    eircode,
    setEircode,
    postcode,
    setPostcode,
    phone,
    setPhone,
    email,
    setEmail,
    herdNo,
    setHerdNo,
    farmType,
    setFarmType,
    assignedConsultant,
    setConsultant,
    tags,
    setTags,
  };
}

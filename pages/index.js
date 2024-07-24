import React, {useEffect, useContext, useState} from "react";

import { DonationContext } from "../Context/Donation";
import {Hero, Card, PupUp} from "../Components"
const index = () => {
  const {
	titleData,
	createCampaign,
	getCampaigns,
	getUserCampaigns,
	donate,
	getDonations,
  } = useContext(DonationContext);

  const [allcampaign, setAllcampaign] = useState();
  const [usercampaign, setUsercampaign] = useState();

  useEffect(() => {
	const getCampaignsData = getCampaigns();
	const userCampignsData = getUserCampaigns();
	return async () => {
		const allData = await getCampaignsData;
		const userData = await userCampignsData;
		setAllcampaign(allData);
		setUsercampaign(userData);
	}
  }, []);

  const [openModel, setOpenModel] = useState(false);
  const [donateCampaign, setDonateCampaign] = useState();

  console.log(donateCampaign);
  return (
	<>
		<Hero titleData = {titleData} createCampaign = {createCampaign} />

		<Card
			title = "All Listed Campaign"
			allcampaign = {allcampaign}
			setOpenModel = {setOpenModel}
			setDonate = {setDonateCampaign}
		/>
		<Card
			title = "Your Listed Campaign"
			allcampaign = {usercampaign}
			setOpenModel = {setOpenModel}
			setDonate = {setDonateCampaign}
		/>

		{openModel && (
			<PopUp
				setOpenModel = {setOpenModel}
				getDonations = {getDonations}
				donate = {donateCampaign}
				donateFunction = {donate}
			/>
		)}
	</>
  )
};

export default index;

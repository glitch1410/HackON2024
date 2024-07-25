import React, { useState, useEffect, Children } from "react";
import Web3Modal from "web3modal";
import {ethers} from "ethers";

import {DonationAddress,DonationABI} from "./contants"
import { waitUntilSymbol } from "next/dist/server/web/spec-extension/fetch-event";

const fetchContract = (signerOrProvider) =>
	new ethers.Contract(DonationAddress, DonationABI, signerOrProvider);

export const DonationContext = React.createContext();

export const DonationProvider = ({children}) => {
	const titleData = "Donation Contract";
	const [currentAccount, setCurrentAccount] = useState("");

	const createCampaign = async (canpaign) => {
		const {title, description, amount, deadline} = canpaign;
		const web3modal = new Web3Modal();
		const connection = await web3modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		const signer = provider.getSigner();
		const contract = fetchContract(signer);

		console.log(currentAccount);
		try {
			const transaction = await contract.createCampaign (
				currentAccount,
				title,
				description,
				ethers.utils.parseUnits(amount, 18),
				new Date(deadline).getTime()
			);

			await transaction.wait();

			console.log("contract call sucess", transaction);
		}
		catch (error) {
			console.log("contract call faliure", error);
		}
	}

	const getCampaigns = async () => {
		const provider = new ethers.providers.JsonRpcProvider();
		const contract = fetchContract(provider);

		const campaigns = await contract.getCampaigns();

		const parsedCampaigns = campaigns.map((campaign, i) => ({
			owner: campaign.owner,
			title: campaign.title,
			description: campaign.description,
			target: ethers.utils.formatEther(campaign.target.toString()),
			deadline: campaign.deadline.toNumber(),
			amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
			pId: i,
		}));

		return parsedCampaigns;
	};

	const getUserCampaigns = async () => {
		const provider = new ethers.providers.JsonRpcProvider();
		const contract = fetchContract(provider);

		const allCampaigns = await contract.getCampaigns();

		const accounts = await window.ethereum.request({
			method: "eth_accounts",
		});
		const currentUser = accounts[0];

		const filteredCampaigns = allCampaigns.filter(
			(campaign) => 
				campaign.owner === "0x01040BDd2C4461598a4Acb0718e52853d04ee198"
		);
		
		const userData = filteredCampaigns.map((campaign, i) => ({
			owner: campaign.owner,
			title: campaign.title,
			description: campaign.description,
			target: ethers.utils.formatEther(campaign.target.toString()),
			deadline: campaign.deadline.toNumber(),
			amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
			pId: i,
		}));

		return userData;
	}

	const donate = async (pId, amount) => {
		const web3modal = new Wenb3Model();
		const connection = await web3modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		const signer = provider.getSigner();
		const contract = fetchContract(signer);

		const campaignData = await contract.donateToCampaign(pId, {
			value: ethers.utils.parseEther(amount),
		});

		await campaignData.wait();
		location.reload();

		return campaignData;
	};

	const getDonations = async (pId) => {
		const web3modal = new Web3Modal();
		const connection = await web3modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		const signer = provider.getSigner();
		const contract = fetchContract(signer);
		const donations = await contract.getDonators(pId);
		const numberOfDonations = donations[0].length;

		const parsedDonations = [];

		for (let i = 0; i < numberOfDonations; i++) {
			parsedDonations.push({
				donator: donations[0][i],
				donation: ethers.utils.formatEther(donations[1][i].toString()),
			});
		}
		return parsedDonations;
	}

	const checkIfWalletConnected = async () => {
		try {
			if(!window.ethereum)
				return setOpenError(true), setError("Install Metamask");

			const accounts = await window.ethereum.request({
				method: "eth_accounts",
			});

			if(accounts.lenght){
				setCurrentAccount(accounts[0]);
			}
			
		} catch{
			console.log("Something went wrong")
		}
	};

	useEffect(() => {
		checkIfWalletConnected();
	}, []);

	const connectWallet = async () => {
		try {
			if(!window.ethereum)
				return console.log("Install Metamask");

			const accounts = await window.ethereum.request({
				method: "eth_requestAccounts",
			});
			setCurrentAccount(accounts[0]);	
		} catch{
			console.log("Something went wrong")
		}
	};

	return (
		<DonationContext.Provider
			value = {{
				titleData,
				currentAccount,
				createCampaign,
				getCampaigns,
				getUserCampaigns,
				donate,
				getDonations,
				connectWallet,
			}}
		>
			{children}
		</DonationContext.Provider>
	);
};

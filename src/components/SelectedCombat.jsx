import React, { Component } from 'react';
import { Row, Col, Button } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import CardHero from './CardHero/CardHero';
import getHeroDataFromApi from '../functions/getHeroDataFromApi';
import handleCombat from '../functions/handleCombat';
import Loading from './Loading.jsx';
import axios from 'axios';

class RandomCombat extends Component {
	state = {
		search: '',
		heroStore: [],
		isLoading: true
	};

	componentDidMount() {
		getHeroDataFromApi().then(hero2 => this.setState({ hero2 }));
	}

	handleClickCombat = () => {
		this.setState({ hideButton: true });
		while (this.state.hero1.powerstats.life !== 0 && this.state.hero2.powerstats.life !== 0) {
			let newStats = handleCombat(this.state);
			this.setState(newStats);
		}
	};

	winnerName = () => {
		if (!this.state.hero1.powerstats.life) {
			return this.state.hero2.name;
		}
		if (!this.state.hero2.powerstats.life) {
			return this.state.hero1.name;
		}
	};

	loadingHeroes = hero => {
		return hero.loading ? (
			<Loading />
		) : (
			<div className='animate'>
				<CardHero props={hero} />
			</div>
		);
	};

	handleChange = e => {
		this.setState({ search: e.target.value });
	};

	normalizePowerstats = stats => (stats !== 'null' ? parseInt(stats) : Math.floor(Math.random() * 40) + 20);
	normalizeInformations = data =>
		data !== 'null' && data !== '0 cm' && data !== '0 kg' && data !== '' ? data : 'Unknown';
	getHerosData = e => {
		this.setState({ heroStore: [] });
		axios
			.get(`https://www.superheroapi.com/api.php/10219454314208202/search/${this.state.search}`)
			.then(res =>
				res.data.results.map((data, i) => {
					let id = this.normalizePowerstats(data.id);
					let name = this.normalizeInformations(data.name);

					let intelligence = this.normalizePowerstats(data.powerstats.intelligence);
					let strength = this.normalizePowerstats(data.powerstats.strength);
					let speed = this.normalizePowerstats(data.powerstats.speed);
					let durability = this.normalizePowerstats(data.powerstats.durability);
					let power = this.normalizePowerstats(data.powerstats.power);
					let combat = this.normalizePowerstats(data.powerstats.combat);
					let life = this.normalizePowerstats(data.powerstats.durability);

					let fullname = this.normalizeInformations(data.biography['full-name']);
					let publisher = this.normalizeInformations(data.biography.publisher);
					let alignment = this.normalizeInformations(data.biography.alignment);

					let gender = this.normalizeInformations(data.appearance.gender);
					let race = this.normalizeInformations(data.appearance.race);
					let height = this.normalizeInformations(data.appearance.height[1]);
					let weight = this.normalizeInformations(data.appearance.weight[1]);

					let image = this.normalizeInformations(data.image);

					let star = (intelligence + strength + speed + durability + power + combat + durability) / 100;

					return this.setState(prevState => ({
						heroStore: [
							...prevState.heroStore,
							{
								id: id,
								name: name,
								powerstats: {
									intelligence: intelligence,
									strength: strength,
									speed: speed,
									durability: durability,
									power: power,
									combat: combat,
									life: life
								},
								biography: { fullname: fullname, publisher: publisher, alignment: alignment },
								appearance: { gender: gender, race: race, height: height, weight: weight },
								image: image,
								star
							}
						]
					}));
				})
			)
			.catch(error => console.log(error));

		e.preventDefault();
	};

	loadingHeroes = hero => {
		return hero.loading ? <Loading /> : <div className='animate' />;
	};

	handleClickSelect = () => {
		getHeroDataFromApi().then(hero2 =>
			this.setState({
				hero1: {
					id: this.state.hero1.id,
					name: this.state.hero1.name,
					powerstats: {
						intelligence: this.state.hero1.intelligence,
						strength: this.state.hero1.strength,
						speed: this.state.hero1.speed,
						durability: this.state.hero1.durability,
						power: this.state.hero1.power,
						combat: this.state.hero1.combat,
						life: this.state.hero1.durability
					},
					biography: { ...this.state.hero1.biography },
					appearance: { ...this.state.hero1.appearance },
					image: this.state.hero1.image,
					star: this.state.hero1.star
				},
				hero2
			})
		);
	};

	render() {
		return (
			<div>
				<Row>
					<NavLink className='btn outline btn-primary' activeClassName='btn-danger' exact to='/'>
						Back to Main
					</NavLink>
					<button name='Reset hero' onClick={() => this.setState({ hero1: undefined, search: [] })}>
						Change hero
					</button>
				</Row>

				{this.state.hero1 ? (
					<Row className='no-gutters'>
						<Col xs='4'>
							<CardHero props={this.state.hero1} />
						</Col>
						<Col xs='4'>
							<Button onClick={this.handleClickSelect} className='random-button' color='secondary'>
								Change Oppenent
							</Button>
							<Button onClick={this.handleClickCombat} className='fight-button' color='danger'>
								FIGHT
							</Button>
						</Col>
						<Col xs='4'>
							<CardHero props={this.state.hero2} />
						</Col>
					</Row>
				) : (
					<div>
						<form onSubmit={this.getHerosData}>
							<label>Name:{this.state.search}</label>
							<br />
							<input type='text' onChange={this.handleChange} value={this.state.search} name='search' id='search' />
							<input type='submit' value='Submit' />
						</form>
						<Row className='no-gutters'>
							{this.state.heroStore.map(x => (
								<Col
									key={x.id}
									xs='4'
									onClick={() => {
										this.setState({ hero1: x });
										getHeroDataFromApi().then(hero2 => this.setState({ hero2 }));
									}}>
									<CardHero props={x} />
								</Col>
							))}
						</Row>
					</div>
				)}
			</div>
		);
	}
}

export default RandomCombat;

import React, { Component } from 'react';
import ErrorComp from './ErrorComponent';
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import CircularProgress from '@material-ui/core/CircularProgress';
import Brightness4Icon from '@material-ui/icons/Brightness4';
import IconButton from '@material-ui/core/IconButton';
import Backdrop from '@material-ui/core/Backdrop';

const styles =  (theme) => ({
	textarea: {
	  border: 'none',
	  overflow: 'hidden',
	  overflowWrap: 'break-word',
	  resize: 'none',
	  height: '400px',
	  width:'100%'
	},
	backdrop: {
		zIndex: theme.zIndex.drawer + 1,
		color: '#fff',
	},
	typographyTitle: {
	  marginTop:'16px'
	},
	underline: {
		"&&&:before": {
			borderBottom: "none"
		},
		"&&:after": {
			borderBottom: "none"
		}
	},
	themeButton: {
		position: 'absolute',
		top: '8px',
		right: '8px',
	},
});

class Home extends Component{
	constructor(props){
		super(props);

		this.state = {
			content: null,
			selfDestruct:'',
		 };
	}

	static getDerivedStateFromProps(nextProps, prevState) {
		var mainNote = nextProps.notes.items.filter(n => n.isMainNote)[0];
		if(prevState.content == null && mainNote){
			return {
				content: mainNote.content,
			};
		 }
		 else
			return null;
	}



	onClickSave = () =>{
		const mainNote = this.props.notes.items.filter(n => n.isMainNote)[0]
		this.props.postNote({ ...mainNote,
			content: this.state.content,
			selfDestruct: this.state.selfDestruct,
			isMainNote: true
		});
	}

	onClickClear = () =>{
		this.setState({content: ''});
	}

	onChangeContent = event => {
		this.setState({content: event.target.value});
	};

	isLoading(){
		return (this.props.notes.isLoading === undefined || this.props.notes.isLoading);
	}

	HomeNote = (props) => {
		return(
			<Card className={props.classes.card} variant="outlined">
				<CardContent>
				<TextField  fullWidth
						id="content"
						placeholder="Type something..."
						multiline
						rows="16"
						InputProps={{ className: props.classes.underline }} 
						onChange={this.onChangeContent} value={this.state.content}
					/>
					{/* <textarea className={classes.textarea} placeholder='Type something...'
						onChange={e => this.updateInput(e.target.value)} value={this.state.input} >
					</textarea> */}
				</CardContent>
				<CardActions className={props.classes.cardActions}>
					<Button variant="contained" color="primary"
						onClick={this.onClickSave}>
						Save
					</Button>
					<Button color="primary" onClick={this.onClickClear}>
						Clear
					</Button>
				</CardActions>
			</Card>
		);
	}
	
	render() {

		const { classes } = this.props;
		return(
			<Container maxWidth="sm">
				<Backdrop className={classes.backdrop} open={this.props.notes.isLoading}>
					<CircularProgress color="inherit" />
				</Backdrop>
				<IconButton onClick={this.props.handleThemeToggle} className={classes.themeButton}>
					<Brightness4Icon />
				</IconButton>
				<Typography variant="h2" gutterBottom className={classes.typographyTitle}>Local Box</Typography>
				{ this.props.notes.error
					? <ErrorComp error={this.props.notes.error}/>
					: <this.HomeNote classes={classes}/> }
			</Container>
		);

	}
}
export default withStyles(styles)(Home);
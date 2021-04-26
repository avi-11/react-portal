import React, { useEffect, useState } from "react";
import { Layout, Menu, Modal, Row, Col, Button } from "antd";
import routes from "../../utils/_routes";
import { getRole } from "../../utils/services";
import { Switch, Link, Redirect } from "react-router-dom";
import logo from "../../utils/assets/images/logo-white.svg";
import logoCollapse from "../../utils/assets/images/logo_collapse.svg";
import { IoIosArrowRoundBack } from "react-icons/io";
import styled from "styled-components";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "./Dashboard";
import EventList from "../Events/EventsList";
import ParticipantsList from "../Participants/ParticipantsList";
import TeamList from "../Team/TeamList";
import Profile from "../Profile/Profile";
import { AiOutlineLeft, AiOutlineLock, AiOutlineRight } from "react-icons/ai";

const { Content, Sider } = Layout;
const smallDeviceWidth = 420;
const Navigator = props => {
	const [isCollapsed, setIsCollapsed] = useState(true);
	const [visible, setVisible] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const Creds = getRole();

	useEffect(() => {
		if (window.innerWidth > smallDeviceWidth) setIsCollapsed(false);
	}, []);

	const setIsCollapsedState = () => {
		if (window.innerWidth < smallDeviceWidth) return;
		setIsCollapsed(!isCollapsed);
	};

	const handleSignOut = state => {
		if (state) {
			setIsLoading(true);
			setTimeout(() => {
				localStorage.clear();
				props.history.push("/login");
			}, 1000);
		} else {
			setVisible(state);
		}
	};

	const Wrapper = styled.div`
		padding: 10px 20px;
	`;
	const Head = styled.div`
		padding-bottom: 20px;
		font-size: 16px;
	`;

	const NoButton = styled(Button)`
		background-color: #ffffff !important;
		color: #1890ff !important;
		border: 2px solid #1890ff !important;
	`;

	// useEffect(() => {
	// 	if (
	// 		!localStorage.getItem("token") ||
	// 		localStorage.getItem("token") === "undefined"
	// 	) {
	// 		props.history.push("/login");
	// 	}
	// }, [history]);

	return (
		<>
			<Layout>
				<Sider
					width={200}
					style={{
						overflow: "auto",
						height: "100%",
						position: "fixed",
						left: 0
					}}
					theme="dark"
					trigger={null}
					collapsible
					collapsed={isCollapsed}
				>
					<div className="logo">
						<img
							onClick={() => setIsCollapsedState()}
							src={isCollapsed ? logoCollapse : logo}
							width={`${isCollapsed ? "84" : "160"}`}
							style={{ padding: "12px 24px", cursor: "pointer" }}
							alt=""
						/>
					</div>
					<hr style={{ margin: 0, padding: 0 }} />
					<Menu
						theme="dark"
						height="100%"
						mode="inline"
						defaultSelectedKeys={"dashboard"}
					>
						{routes.map((route, idx) => {
							if (
								Creds.role === "member" &&
								route.key === "participants"
							) {
								return null;
							} else {
								return (
									<Menu.Item
										style={{
											alignItems: "center"
										}}
										key={route.key}
										onClick={() => {
											localStorage.setItem(
												"routeKey",
												route.key
											);
										}}
										title={route.name}
									>
										<route.icon
											style={{ fontSize: "18px" }}
										/>
										{isCollapsed ? null : (
											<span
												style={{
													paddingLeft: "10px"
												}}
											>
												{route.name}
											</span>
										)}
										<Link to={route.path} />
									</Menu.Item>
								);
							}
						})}
						<Menu.Item
							key={"signout"}
							onClick={() => setVisible(true)}
						>
							<AiOutlineLock />
							{isCollapsed ? null : (
								<span style={{ paddingLeft: "10px" }}>
									Sign Out
								</span>
							)}
						</Menu.Item>
						{window.innerWidth > smallDeviceWidth ? (
							<Menu.Item
								key={"collapse"}
								onClick={() => setIsCollapsed(!isCollapsed)}
							>
								{isCollapsed ? (
									<AiOutlineRight />
								) : (
									<AiOutlineLeft />
								)}

								{isCollapsed ? null : (
									<span style={{ paddingLeft: "10px" }}>
										Hide
									</span>
								)}
							</Menu.Item>
						) : null}
					</Menu>
				</Sider>

				<Layout
					style={{
						minHeight: "100vh",
						marginLeft: `${isCollapsed ? "80px" : "200px"}`
					}}
				>
					<Content
						style={{
							margin: 12,
							padding: 20,
							background: "#f9f9f9",
							minHeight: "280"
						}}
					>
						<Switch>
							<PrivateRoute
								exact
								path="/"
								component={Dashboard}
								data={Creds}
							/>
							<PrivateRoute
								exact
								path="/events"
								component={EventList}
								data={Creds}
							/>
							<PrivateRoute
								exact
								path="/participants"
								component={ParticipantsList}
								data={Creds}
							/>
							<PrivateRoute
								exact
								path="/team"
								component={TeamList}
								data={Creds}
							/>
							<PrivateRoute
								exact
								path="/profile"
								component={Profile}
								data={Creds}
							/>

							<Redirect from="/dashboard" to="/" />
						</Switch>
					</Content>
				</Layout>
			</Layout>

			<Modal
				visible={visible}
				footer={null}
				closable={false}
				onCancel={() => handleSignOut(false)}
			>
				<IoIosArrowRoundBack
					onClick={() => handleSignOut(false)}
					style={{ fontSize: "28px", cursor: "pointer" }}
				/>

				<Wrapper>
					<Head>
						<Row>
							<Col xs={5}></Col>
							<Col>Do you really want to sign out ?</Col>
							<Col xs={5}></Col>
						</Row>
					</Head>
					<Row>
						<Col xs={5}></Col>
						<Col xs={6} style={{ paddingLeft: "8px" }}>
							<NoButton
								type="primary"
								onClick={() => handleSignOut(false)}
							>
								No
							</NoButton>
						</Col>
						<Col
							xs={7}
							style={{
								display: "flex",
								justifyContent: "flex-end"
							}}
						>
							<Button
								type="primary"
								loading={isLoading}
								onClick={() => handleSignOut(true)}
							>
								Yes
							</Button>
						</Col>
						<Col xs={5}></Col>
					</Row>
				</Wrapper>
			</Modal>
		</>
	);
};

export default Navigator;

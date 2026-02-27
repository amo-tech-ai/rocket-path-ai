import { defineRelations } from "drizzle-orm";
import * as schema from "./schema";

export const relations = defineRelations(schema, (r) => ({
	identitiesInAuth: {
		usersInAuth: r.one.usersInAuth({
			from: r.identitiesInAuth.userId,
			to: r.usersInAuth.id
		}),
	},
	usersInAuth: {
		identitiesInAuths: r.many.identitiesInAuth(),
		mfaFactorsInAuths: r.many.mfaFactorsInAuth(),
		oauthClientsInAuthsViaOauthAuthorizationsInAuth: r.many.oauthClientsInAuth({
			alias: "oauthClientsInAuth_id_usersInAuth_id_via_oauthAuthorizationsInAuth"
		}),
		oauthClientsInAuthsViaOauthConsentsInAuth: r.many.oauthClientsInAuth({
			alias: "oauthClientsInAuth_id_usersInAuth_id_via_oauthConsentsInAuth"
		}),
		oneTimeTokensInAuths: r.many.oneTimeTokensInAuth(),
		oauthClientsInAuthsViaSessionsInAuth: r.many.oauthClientsInAuth({
			alias: "oauthClientsInAuth_id_usersInAuth_id_via_sessionsInAuth"
		}),
		activities: r.many.activities(),
		startupsViaDecisions: r.many.startups({
			from: r.usersInAuth.id.through(r.decisions.decidedBy),
			to: r.startups.id.through(r.decisions.startupId),
			alias: "usersInAuth_id_startups_id_via_decisions"
		}),
		organizationsViaDeckTemplates: r.many.organizations({
			from: r.usersInAuth.id.through(r.deckTemplates.createdBy),
			to: r.organizations.id.through(r.deckTemplates.orgId),
			alias: "usersInAuth_id_organizations_id_via_deckTemplates"
		}),
		documents: r.many.documents({
			from: r.usersInAuth.id.through(r.documentVersions.createdBy),
			to: r.documents.id.through(r.documentVersions.documentId)
		}),
		eventAssetsApprovedBy: r.many.eventAssets({
			alias: "eventAssets_approvedBy_usersInAuth_id"
		}),
		eventAssetsCreatedBy: r.many.eventAssets({
			alias: "eventAssets_createdBy_usersInAuth_id"
		}),
		eventAttendees: r.many.eventAttendees(),
		eventsViaEventVenues: r.many.events({
			from: r.usersInAuth.id.through(r.eventVenues.createdBy),
			to: r.events.id.through(r.eventVenues.eventId),
			alias: "usersInAuth_id_events_id_via_eventVenues"
		}),
		eventsCreatedBy: r.many.events({
			alias: "events_createdBy_usersInAuth_id"
		}),
		experiments: r.many.experiments(),
		interviewInsights: r.many.interviewInsights(),
		interviews: r.many.interviews(),
		leanCanvases: r.many.leanCanvases(),
		messagesCreatedBy: r.many.messages({
			alias: "messages_createdBy_usersInAuth_id"
		}),
		messagesEscalatedTo: r.many.messages({
			alias: "messages_escalatedTo_usersInAuth_id"
		}),
		pitchDecksCreatedBy: r.many.pitchDecks({
			alias: "pitchDecks_createdBy_usersInAuth_id"
		}),
		pitchDecksLastEditedBy: r.many.pitchDecks({
			alias: "pitchDecks_lastEditedBy_usersInAuth_id"
		}),
		organizationsViaProfiles: r.many.organizations({
			from: r.usersInAuth.id.through(r.profiles.id),
			to: r.organizations.id.through(r.profiles.orgId),
			alias: "usersInAuth_id_organizations_id_via_profiles"
		}),
		promptPackRuns: r.many.promptPackRuns(),
		startupsViaShareableLinks: r.many.startups({
			from: r.usersInAuth.id.through(r.shareableLinks.createdBy),
			to: r.startups.id.through(r.shareableLinks.startupId),
			alias: "usersInAuth_id_startups_id_via_shareableLinks"
		}),
		sponsors: r.many.sponsors(),
		startupMembersInvitedBy: r.many.startupMembers({
			alias: "startupMembers_invitedBy_usersInAuth_id"
		}),
		startupMembersUserId: r.many.startupMembers({
			alias: "startupMembers_userId_usersInAuth_id"
		}),
		industryEvents: r.many.industryEvents(),
		userRoles: r.many.userRoles(),
		startupsViaValidatorSessions: r.many.startups({
			alias: "startups_id_usersInAuth_id_via_validatorSessions"
		}),
		startupsViaWeeklyReviews: r.many.startups({
			from: r.usersInAuth.id.through(r.weeklyReviews.createdBy),
			to: r.startups.id.through(r.weeklyReviews.startupId),
			alias: "usersInAuth_id_startups_id_via_weeklyReviews"
		}),
		workflows: r.many.workflows(),
	},
	mfaAmrClaimsInAuth: {
		sessionsInAuth: r.one.sessionsInAuth({
			from: r.mfaAmrClaimsInAuth.sessionId,
			to: r.sessionsInAuth.id
		}),
	},
	sessionsInAuth: {
		mfaAmrClaimsInAuths: r.many.mfaAmrClaimsInAuth(),
		refreshTokensInAuths: r.many.refreshTokensInAuth(),
	},
	mfaChallengesInAuth: {
		mfaFactorsInAuth: r.one.mfaFactorsInAuth({
			from: r.mfaChallengesInAuth.factorId,
			to: r.mfaFactorsInAuth.id
		}),
	},
	mfaFactorsInAuth: {
		mfaChallengesInAuths: r.many.mfaChallengesInAuth(),
		usersInAuth: r.one.usersInAuth({
			from: r.mfaFactorsInAuth.userId,
			to: r.usersInAuth.id
		}),
	},
	oauthClientsInAuth: {
		usersInAuthsViaOauthAuthorizationsInAuth: r.many.usersInAuth({
			from: r.oauthClientsInAuth.id.through(r.oauthAuthorizationsInAuth.clientId),
			to: r.usersInAuth.id.through(r.oauthAuthorizationsInAuth.userId),
			alias: "oauthClientsInAuth_id_usersInAuth_id_via_oauthAuthorizationsInAuth"
		}),
		usersInAuthsViaOauthConsentsInAuth: r.many.usersInAuth({
			from: r.oauthClientsInAuth.id.through(r.oauthConsentsInAuth.clientId),
			to: r.usersInAuth.id.through(r.oauthConsentsInAuth.userId),
			alias: "oauthClientsInAuth_id_usersInAuth_id_via_oauthConsentsInAuth"
		}),
		usersInAuthsViaSessionsInAuth: r.many.usersInAuth({
			from: r.oauthClientsInAuth.id.through(r.sessionsInAuth.oauthClientId),
			to: r.usersInAuth.id.through(r.sessionsInAuth.userId),
			alias: "oauthClientsInAuth_id_usersInAuth_id_via_sessionsInAuth"
		}),
	},
	oneTimeTokensInAuth: {
		usersInAuth: r.one.usersInAuth({
			from: r.oneTimeTokensInAuth.userId,
			to: r.usersInAuth.id
		}),
	},
	refreshTokensInAuth: {
		sessionsInAuth: r.one.sessionsInAuth({
			from: r.refreshTokensInAuth.sessionId,
			to: r.sessionsInAuth.id
		}),
	},
	samlProvidersInAuth: {
		ssoProvidersInAuth: r.one.ssoProvidersInAuth({
			from: r.samlProvidersInAuth.ssoProviderId,
			to: r.ssoProvidersInAuth.id
		}),
	},
	ssoProvidersInAuth: {
		samlProvidersInAuths: r.many.samlProvidersInAuth(),
		flowStateInAuths: r.many.flowStateInAuth(),
		ssoDomainsInAuths: r.many.ssoDomainsInAuth(),
	},
	flowStateInAuth: {
		ssoProvidersInAuths: r.many.ssoProvidersInAuth({
			from: r.flowStateInAuth.id.through(r.samlRelayStatesInAuth.flowStateId),
			to: r.ssoProvidersInAuth.id.through(r.samlRelayStatesInAuth.ssoProviderId)
		}),
	},
	ssoDomainsInAuth: {
		ssoProvidersInAuth: r.one.ssoProvidersInAuth({
			from: r.ssoDomainsInAuth.ssoProviderId,
			to: r.ssoProvidersInAuth.id
		}),
	},
	proposedActions: {
		profiles: r.many.profiles({
			from: r.proposedActions.id.through(r.actionExecutions.actionId),
			to: r.profiles.id.through(r.actionExecutions.rolledBackBy),
			alias: "proposedActions_id_profiles_id_via_actionExecutions"
		}),
		auditLogs: r.many.auditLog(),
		aiRun: r.one.aiRuns({
			from: r.proposedActions.aiRunId,
			to: r.aiRuns.id
		}),
		profileApprovedBy: r.one.profiles({
			from: r.proposedActions.approvedBy,
			to: r.profiles.id,
			alias: "proposedActions_approvedBy_profiles_id"
		}),
		organization: r.one.organizations({
			from: r.proposedActions.orgId,
			to: r.organizations.id
		}),
		startup: r.one.startups({
			from: r.proposedActions.startupId,
			to: r.startups.id
		}),
		profileUserId: r.one.profiles({
			from: r.proposedActions.userId,
			to: r.profiles.id,
			alias: "proposedActions_userId_profiles_id"
		}),
	},
	profiles: {
		proposedActionsViaActionExecutions: r.many.proposedActions({
			alias: "proposedActions_id_profiles_id_via_actionExecutions"
		}),
		aiRuns: r.many.aiRuns(),
		auditLogs: r.many.auditLog(),
		chatFacts: r.many.chatFacts(),
		chatMessagesUserId: r.many.chatMessages({
			alias: "chatMessages_userId_profiles_id"
		}),
		chatMessagesViaChatPending: r.many.chatMessages({
			alias: "chatMessages_id_profiles_id_via_chatPending"
		}),
		startupsViaChatSessions: r.many.startups({
			alias: "startups_id_profiles_id_via_chatSessions"
		}),
		communications: r.many.communications(),
		contacts: r.many.contacts(),
		documents: r.many.documents(),
		startupsViaFileUploads: r.many.startups({
			alias: "startups_id_profiles_id_via_fileUploads"
		}),
		notifications: r.many.notifications(),
		orgMembersInvitedBy: r.many.orgMembers({
			alias: "orgMembers_invitedBy_profiles_id"
		}),
		orgMembersUserId: r.many.orgMembers({
			alias: "orgMembers_userId_profiles_id"
		}),
		startupsViaProjects: r.many.startups({
			from: r.profiles.id.through(r.projects.ownerId),
			to: r.startups.id.through(r.projects.startupId),
			alias: "profiles_id_startups_id_via_projects"
		}),
		proposedActionsApprovedBy: r.many.proposedActions({
			alias: "proposedActions_approvedBy_profiles_id"
		}),
		proposedActionsUserId: r.many.proposedActions({
			alias: "proposedActions_userId_profiles_id"
		}),
		tasksAssignedTo: r.many.tasks({
			alias: "tasks_assignedTo_profiles_id"
		}),
		tasksCreatedBy: r.many.tasks({
			alias: "tasks_createdBy_profiles_id"
		}),
		startupsViaWizardSessions: r.many.startups({
			alias: "startups_id_profiles_id_via_wizardSessions"
		}),
	},
	activities: {
		contact: r.one.contacts({
			from: r.activities.contactId,
			to: r.contacts.id
		}),
		deal: r.one.deals({
			from: r.activities.dealId,
			to: r.deals.id
		}),
		document: r.one.documents({
			from: r.activities.documentId,
			to: r.documents.id
		}),
		organization: r.one.organizations({
			from: r.activities.orgId,
			to: r.organizations.id
		}),
		project: r.one.projects({
			from: r.activities.projectId,
			to: r.projects.id
		}),
		startup: r.one.startups({
			from: r.activities.startupId,
			to: r.startups.id
		}),
		task: r.one.tasks({
			from: r.activities.taskId,
			to: r.tasks.id
		}),
		usersInAuth: r.one.usersInAuth({
			from: r.activities.userId,
			to: r.usersInAuth.id
		}),
	},
	contacts: {
		activities: r.many.activities(),
		communications: r.many.communications(),
		profiles: r.many.profiles({
			from: r.contacts.id.through(r.contactTags.contactId),
			to: r.profiles.id.through(r.contactTags.createdBy)
		}),
		startupsViaContacts: r.many.startups({
			from: r.contacts.id.through(r.contacts.referredBy),
			to: r.startups.id.through(r.contacts.startupId),
			alias: "contacts_id_startups_id_via_contacts"
		}),
		startupsViaDeals: r.many.startups({
			from: r.contacts.id.through(r.deals.contactId),
			to: r.startups.id.through(r.deals.startupId),
			alias: "contacts_id_startups_id_via_deals"
		}),
		eventAttendees: r.many.eventAttendees(),
		events: r.many.events(),
		sponsors: r.many.sponsors(),
		tasks: r.many.tasks(),
	},
	deals: {
		activities: r.many.activities(),
		communications: r.many.communications(),
		events: r.many.events(),
		tasks: r.many.tasks(),
	},
	documents: {
		activities: r.many.activities(),
		usersInAuths: r.many.usersInAuth(),
		profile: r.one.profiles({
			from: r.documents.createdBy,
			to: r.profiles.id
		}),
		startup: r.one.startups({
			from: r.documents.startupId,
			to: r.startups.id
		}),
		wizardSession: r.one.wizardSessions({
			from: r.documents.wizardSessionId,
			to: r.wizardSessions.id
		}),
	},
	organizations: {
		activities: r.many.activities(),
		agentConfigs: r.many.agentConfigs(),
		aiRuns: r.many.aiRuns(),
		aiUsageLimits: r.many.aiUsageLimits(),
		auditLogs: r.many.auditLog(),
		usersInAuthsViaDeckTemplates: r.many.usersInAuth({
			alias: "usersInAuth_id_organizations_id_via_deckTemplates"
		}),
		integrations: r.many.integrations(),
		orgMembers: r.many.orgMembers(),
		usersInAuthsViaProfiles: r.many.usersInAuth({
			alias: "usersInAuth_id_organizations_id_via_profiles"
		}),
		promptPackRuns: r.many.promptPackRuns(),
		proposedActions: r.many.proposedActions(),
		startups: r.many.startups(),
		workflowActivityLogs: r.many.workflowActivityLog(),
		workflows: r.many.workflows(),
	},
	projects: {
		activities: r.many.activities(),
		events: r.many.events(),
		tasks: r.many.tasks(),
	},
	startups: {
		activities: r.many.activities(),
		aiRuns: r.many.aiRuns(),
		leanCanvases: r.many.leanCanvases(),
		auditLogs: r.many.auditLog(),
		campaigns: r.many.campaigns(),
		chatFacts: r.many.chatFacts(),
		profilesViaChatSessions: r.many.profiles({
			from: r.startups.id.through(r.chatSessions.startupId),
			to: r.profiles.id.through(r.chatSessions.userId),
			alias: "startups_id_profiles_id_via_chatSessions"
		}),
		communications: r.many.communications(),
		competitorProfiles: r.many.competitorProfiles(),
		contactsViaContacts: r.many.contacts({
			alias: "contacts_id_startups_id_via_contacts"
		}),
		customerSegments: r.many.customerSegments(),
		dailyFocusRecommendations: r.many.dailyFocusRecommendations(),
		dashboardMetricsCaches: r.many.dashboardMetricsCache(),
		contactsViaDeals: r.many.contacts({
			alias: "contacts_id_startups_id_via_deals"
		}),
		usersInAuthsViaDecisions: r.many.usersInAuth({
			alias: "usersInAuth_id_startups_id_via_decisions"
		}),
		documents: r.many.documents(),
		events: r.many.events(),
		profilesViaFileUploads: r.many.profiles({
			from: r.startups.id.through(r.fileUploads.startupId),
			to: r.profiles.id.through(r.fileUploads.uploadedBy),
			alias: "startups_id_profiles_id_via_fileUploads"
		}),
		financialModels: r.many.financialModels(),
		interviews: r.many.interviews(),
		investors: r.many.investors(),
		knowledgeMaps: r.many.knowledgeMap(),
		playbookRunsViaLeanCanvases: r.many.playbookRuns({
			alias: "playbookRuns_id_startups_id_via_leanCanvases"
		}),
		marketResearches: r.many.marketResearch(),
		metricSnapshots: r.many.metricSnapshots(),
		opportunityCanvas: r.many.opportunityCanvas(),
		pitchDecks: r.many.pitchDecks(),
		assumptions: r.many.assumptions(),
		playbookRunsStartupId: r.many.playbookRuns({
			alias: "playbookRuns_startupId_startups_id"
		}),
		profilesViaProjects: r.many.profiles({
			alias: "profiles_id_startups_id_via_projects"
		}),
		promptPackRuns: r.many.promptPackRuns(),
		proposedActions: r.many.proposedActions(),
		usersInAuthsViaShareableLinks: r.many.usersInAuth({
			alias: "usersInAuth_id_startups_id_via_shareableLinks"
		}),
		startupHealthScores: r.many.startupHealthScores(),
		startupMembers: r.many.startupMembers(),
		organization: r.one.organizations({
			from: r.startups.orgId,
			to: r.organizations.id
		}),
		tasks: r.many.tasks(),
		validatorSessions: r.many.validatorSessions(),
		usersInAuthsViaValidatorSessions: r.many.usersInAuth({
			from: r.startups.id.through(r.validatorSessions.startupId),
			to: r.usersInAuth.id.through(r.validatorSessions.userId),
			alias: "startups_id_usersInAuth_id_via_validatorSessions"
		}),
		usersInAuthsViaWeeklyReviews: r.many.usersInAuth({
			alias: "usersInAuth_id_startups_id_via_weeklyReviews"
		}),
		profilesViaWizardSessions: r.many.profiles({
			from: r.startups.id.through(r.wizardSessions.startupId),
			to: r.profiles.id.through(r.wizardSessions.userId),
			alias: "startups_id_profiles_id_via_wizardSessions"
		}),
		workflowActivityLogs: r.many.workflowActivityLog(),
		workflows: r.many.workflows(),
	},
	tasks: {
		activities: r.many.activities(),
		startupEventTasks: r.many.startupEventTasks(),
		contact: r.one.contacts({
			from: r.tasks.contactId,
			to: r.contacts.id
		}),
		deal: r.one.deals({
			from: r.tasks.dealId,
			to: r.deals.id
		}),
		profileAssignedTo: r.one.profiles({
			from: r.tasks.assignedTo,
			to: r.profiles.id,
			alias: "tasks_assignedTo_profiles_id"
		}),
		profileCreatedBy: r.one.profiles({
			from: r.tasks.createdBy,
			to: r.profiles.id,
			alias: "tasks_createdBy_profiles_id"
		}),
		task: r.one.tasks({
			from: r.tasks.parentTaskId,
			to: r.tasks.id,
			alias: "tasks_parentTaskId_tasks_id"
		}),
		tasks: r.many.tasks({
			alias: "tasks_parentTaskId_tasks_id"
		}),
		project: r.one.projects({
			from: r.tasks.projectId,
			to: r.projects.id
		}),
		startup: r.one.startups({
			from: r.tasks.startupId,
			to: r.startups.id
		}),
		workflowActivityLogs: r.many.workflowActivityLog(),
	},
	agentConfigs: {
		organization: r.one.organizations({
			from: r.agentConfigs.orgId,
			to: r.organizations.id
		}),
	},
	aiRuns: {
		organization: r.one.organizations({
			from: r.aiRuns.orgId,
			to: r.organizations.id
		}),
		startup: r.one.startups({
			from: r.aiRuns.startupId,
			to: r.startups.id
		}),
		profile: r.one.profiles({
			from: r.aiRuns.userId,
			to: r.profiles.id
		}),
		chatMessages: r.many.chatMessages(),
		proposedActions: r.many.proposedActions(),
		wizardSessions: r.many.wizardSessions({
			from: r.aiRuns.id.through(r.wizardExtractions.aiRunId),
			to: r.wizardSessions.id.through(r.wizardExtractions.sessionId)
		}),
	},
	aiUsageLimits: {
		organization: r.one.organizations({
			from: r.aiUsageLimits.orgId,
			to: r.organizations.id
		}),
	},
	leanCanvases: {
		startups: r.many.startups({
			from: r.leanCanvases.id.through(r.assumptions.leanCanvasId),
			to: r.startups.id.through(r.assumptions.startupId)
		}),
		usersInAuths: r.many.usersInAuth({
			from: r.leanCanvases.id.through(r.leanCanvasVersions.canvasId),
			to: r.usersInAuth.id.through(r.leanCanvasVersions.createdBy)
		}),
	},
	auditLog: {
		organization: r.one.organizations({
			from: r.auditLog.orgId,
			to: r.organizations.id
		}),
		proposedAction: r.one.proposedActions({
			from: r.auditLog.proposedActionId,
			to: r.proposedActions.id
		}),
		startup: r.one.startups({
			from: r.auditLog.startupId,
			to: r.startups.id
		}),
		profile: r.one.profiles({
			from: r.auditLog.userId,
			to: r.profiles.id
		}),
	},
	campaigns: {
		startup: r.one.startups({
			from: r.campaigns.startupId,
			to: r.startups.id
		}),
		sprintTasks: r.many.sprintTasks(),
		sprints: r.many.sprints(),
	},
	chatFacts: {
		chatMessage: r.one.chatMessages({
			from: r.chatFacts.sourceMessageId,
			to: r.chatMessages.id
		}),
		startup: r.one.startups({
			from: r.chatFacts.startupId,
			to: r.startups.id
		}),
		profile: r.one.profiles({
			from: r.chatFacts.userId,
			to: r.profiles.id
		}),
	},
	chatMessages: {
		chatFacts: r.many.chatFacts(),
		aiRun: r.one.aiRuns({
			from: r.chatMessages.aiRunId,
			to: r.aiRuns.id
		}),
		chatSession: r.one.chatSessions({
			from: r.chatMessages.sessionId,
			to: r.chatSessions.id
		}),
		profile: r.one.profiles({
			from: r.chatMessages.userId,
			to: r.profiles.id,
			alias: "chatMessages_userId_profiles_id"
		}),
		profiles: r.many.profiles({
			from: r.chatMessages.id.through(r.chatPending.messageId),
			to: r.profiles.id.through(r.chatPending.userId),
			alias: "chatMessages_id_profiles_id_via_chatPending"
		}),
	},
	chatSessions: {
		chatMessages: r.many.chatMessages(),
	},
	communications: {
		contact: r.one.contacts({
			from: r.communications.contactId,
			to: r.contacts.id
		}),
		profile: r.one.profiles({
			from: r.communications.createdBy,
			to: r.profiles.id
		}),
		deal: r.one.deals({
			from: r.communications.dealId,
			to: r.deals.id
		}),
		startup: r.one.startups({
			from: r.communications.startupId,
			to: r.startups.id
		}),
	},
	competitorProfiles: {
		startup: r.one.startups({
			from: r.competitorProfiles.startupId,
			to: r.startups.id
		}),
	},
	customerForces: {
		customerSegment: r.one.customerSegments({
			from: r.customerForces.segmentId,
			to: r.customerSegments.id
		}),
	},
	customerSegments: {
		customerForces: r.many.customerForces(),
		startup: r.one.startups({
			from: r.customerSegments.startupId,
			to: r.startups.id
		}),
		interviews: r.many.interviews(),
		jobsToBeDones: r.many.jobsToBeDone(),
	},
	dailyFocusRecommendations: {
		startup: r.one.startups({
			from: r.dailyFocusRecommendations.startupId,
			to: r.startups.id
		}),
	},
	dashboardMetricsCache: {
		startup: r.one.startups({
			from: r.dashboardMetricsCache.startupId,
			to: r.startups.id
		}),
	},
	decisionEvidence: {
		decision: r.one.decisions({
			from: r.decisionEvidence.decisionId,
			to: r.decisions.id
		}),
	},
	decisions: {
		decisionEvidences: r.many.decisionEvidence(),
	},
	wizardSessions: {
		documents: r.many.documents(),
		aiRuns: r.many.aiRuns(),
	},
	eventAssets: {
		usersInAuthApprovedBy: r.one.usersInAuth({
			from: r.eventAssets.approvedBy,
			to: r.usersInAuth.id,
			alias: "eventAssets_approvedBy_usersInAuth_id"
		}),
		usersInAuthCreatedBy: r.one.usersInAuth({
			from: r.eventAssets.createdBy,
			to: r.usersInAuth.id,
			alias: "eventAssets_createdBy_usersInAuth_id"
		}),
		event: r.one.events({
			from: r.eventAssets.eventId,
			to: r.events.id
		}),
		eventAsset: r.one.eventAssets({
			from: r.eventAssets.parentAssetId,
			to: r.eventAssets.id,
			alias: "eventAssets_parentAssetId_eventAssets_id"
		}),
		eventAssets: r.many.eventAssets({
			alias: "eventAssets_parentAssetId_eventAssets_id"
		}),
	},
	events: {
		eventAssets: r.many.eventAssets(),
		eventAttendees: r.many.eventAttendees(),
		usersInAuths: r.many.usersInAuth({
			alias: "usersInAuth_id_events_id_via_eventVenues"
		}),
		usersInAuth: r.one.usersInAuth({
			from: r.events.createdBy,
			to: r.usersInAuth.id,
			alias: "events_createdBy_usersInAuth_id"
		}),
		contact: r.one.contacts({
			from: r.events.relatedContactId,
			to: r.contacts.id
		}),
		deal: r.one.deals({
			from: r.events.relatedDealId,
			to: r.deals.id
		}),
		project: r.one.projects({
			from: r.events.relatedProjectId,
			to: r.projects.id
		}),
		startup: r.one.startups({
			from: r.events.startupId,
			to: r.startups.id
		}),
		messages: r.many.messages(),
		sponsors: r.many.sponsors(),
	},
	eventAttendees: {
		usersInAuth: r.one.usersInAuth({
			from: r.eventAttendees.checkedInBy,
			to: r.usersInAuth.id
		}),
		contact: r.one.contacts({
			from: r.eventAttendees.contactId,
			to: r.contacts.id
		}),
		event: r.one.events({
			from: r.eventAttendees.eventId,
			to: r.events.id
		}),
		messages: r.many.messages(),
	},
	eventSpeakers: {
		industryEvent: r.one.industryEvents({
			from: r.eventSpeakers.eventId,
			to: r.industryEvents.id
		}),
	},
	industryEvents: {
		eventSpeakers: r.many.eventSpeakers(),
		usersInAuths: r.many.usersInAuth({
			from: r.industryEvents.id.through(r.userEventTracking.eventId),
			to: r.usersInAuth.id.through(r.userEventTracking.userId)
		}),
	},
	experiments: {
		usersInAuths: r.many.usersInAuth({
			from: r.experiments.id.through(r.experimentResults.experimentId),
			to: r.usersInAuth.id.through(r.experimentResults.recordedBy)
		}),
		assumption: r.one.assumptions({
			from: r.experiments.assumptionId,
			to: r.assumptions.id
		}),
		interviews: r.many.interviews(),
	},
	assumptions: {
		experiments: r.many.experiments(),
		interviewInsights: r.many.interviewInsights(),
		interviews: r.many.interviews({
			from: r.assumptions.id.through(r.interviewQuestions.hypothesisId),
			to: r.interviews.id.through(r.interviewQuestions.interviewId)
		}),
		startups: r.many.startups({
			from: r.assumptions.id.through(r.pivotLogs.assumptionId),
			to: r.startups.id.through(r.pivotLogs.startupId)
		}),
	},
	financialModels: {
		startup: r.one.startups({
			from: r.financialModels.startupId,
			to: r.startups.id
		}),
	},
	integrations: {
		organization: r.one.organizations({
			from: r.integrations.orgId,
			to: r.organizations.id
		}),
	},
	interviewInsights: {
		assumption: r.one.assumptions({
			from: r.interviewInsights.hypothesisId,
			to: r.assumptions.id
		}),
		interview: r.one.interviews({
			from: r.interviewInsights.interviewId,
			to: r.interviews.id
		}),
		usersInAuth: r.one.usersInAuth({
			from: r.interviewInsights.validatedBy,
			to: r.usersInAuth.id
		}),
	},
	interviews: {
		interviewInsights: r.many.interviewInsights(),
		assumptions: r.many.assumptions(),
		usersInAuth: r.one.usersInAuth({
			from: r.interviews.conductedBy,
			to: r.usersInAuth.id
		}),
		experiment: r.one.experiments({
			from: r.interviews.experimentId,
			to: r.experiments.id
		}),
		customerSegment: r.one.customerSegments({
			from: r.interviews.segmentId,
			to: r.customerSegments.id
		}),
		startup: r.one.startups({
			from: r.interviews.startupId,
			to: r.startups.id
		}),
	},
	investors: {
		startup: r.one.startups({
			from: r.investors.startupId,
			to: r.startups.id
		}),
	},
	jobsToBeDone: {
		customerSegments: r.many.customerSegments({
			from: r.jobsToBeDone.id.through(r.jobsToBeDone.relatedFunctionalJobId),
			to: r.customerSegments.id.through(r.jobsToBeDone.segmentId)
		}),
	},
	knowledgeChunks: {
		knowledgeDocument: r.one.knowledgeDocuments({
			from: r.knowledgeChunks.documentId,
			to: r.knowledgeDocuments.id
		}),
	},
	knowledgeDocuments: {
		knowledgeChunks: r.many.knowledgeChunks(),
	},
	knowledgeMap: {
		startup: r.one.startups({
			from: r.knowledgeMap.startupId,
			to: r.startups.id
		}),
	},
	playbookRuns: {
		startups: r.many.startups({
			from: r.playbookRuns.id.through(r.leanCanvases.playbookRunId),
			to: r.startups.id.through(r.leanCanvases.startupId),
			alias: "playbookRuns_id_startups_id_via_leanCanvases"
		}),
		pitchDecks: r.many.pitchDecks(),
		startup: r.one.startups({
			from: r.playbookRuns.startupId,
			to: r.startups.id,
			alias: "playbookRuns_startupId_startups_id"
		}),
	},
	marketResearch: {
		startup: r.one.startups({
			from: r.marketResearch.startupId,
			to: r.startups.id
		}),
	},
	messages: {
		eventAttendee: r.one.eventAttendees({
			from: r.messages.attendeeId,
			to: r.eventAttendees.id
		}),
		usersInAuthCreatedBy: r.one.usersInAuth({
			from: r.messages.createdBy,
			to: r.usersInAuth.id,
			alias: "messages_createdBy_usersInAuth_id"
		}),
		usersInAuthEscalatedTo: r.one.usersInAuth({
			from: r.messages.escalatedTo,
			to: r.usersInAuth.id,
			alias: "messages_escalatedTo_usersInAuth_id"
		}),
		event: r.one.events({
			from: r.messages.eventId,
			to: r.events.id
		}),
	},
	metricSnapshots: {
		startup: r.one.startups({
			from: r.metricSnapshots.startupId,
			to: r.startups.id
		}),
	},
	notifications: {
		profile: r.one.profiles({
			from: r.notifications.userId,
			to: r.profiles.id
		}),
	},
	opportunityCanvas: {
		startup: r.one.startups({
			from: r.opportunityCanvas.startupId,
			to: r.startups.id
		}),
	},
	orgMembers: {
		profileInvitedBy: r.one.profiles({
			from: r.orgMembers.invitedBy,
			to: r.profiles.id,
			alias: "orgMembers_invitedBy_profiles_id"
		}),
		organization: r.one.organizations({
			from: r.orgMembers.orgId,
			to: r.organizations.id
		}),
		profileUserId: r.one.profiles({
			from: r.orgMembers.userId,
			to: r.profiles.id,
			alias: "orgMembers_userId_profiles_id"
		}),
	},
	pitchDeckSlides: {
		pitchDeck: r.one.pitchDecks({
			from: r.pitchDeckSlides.deckId,
			to: r.pitchDecks.id
		}),
	},
	pitchDecks: {
		pitchDeckSlides: r.many.pitchDeckSlides(),
		usersInAuthCreatedBy: r.one.usersInAuth({
			from: r.pitchDecks.createdBy,
			to: r.usersInAuth.id,
			alias: "pitchDecks_createdBy_usersInAuth_id"
		}),
		usersInAuthLastEditedBy: r.one.usersInAuth({
			from: r.pitchDecks.lastEditedBy,
			to: r.usersInAuth.id,
			alias: "pitchDecks_lastEditedBy_usersInAuth_id"
		}),
		playbookRun: r.one.playbookRuns({
			from: r.pitchDecks.playbookRunId,
			to: r.playbookRuns.id
		}),
		startup: r.one.startups({
			from: r.pitchDecks.startupId,
			to: r.startups.id
		}),
	},
	promptPackRuns: {
		organization: r.one.organizations({
			from: r.promptPackRuns.orgId,
			to: r.organizations.id
		}),
		promptPack: r.one.promptPacks({
			from: r.promptPackRuns.packId,
			to: r.promptPacks.id
		}),
		startup: r.one.startups({
			from: r.promptPackRuns.startupId,
			to: r.startups.id
		}),
		usersInAuth: r.one.usersInAuth({
			from: r.promptPackRuns.userId,
			to: r.usersInAuth.id
		}),
	},
	promptPacks: {
		promptPackRuns: r.many.promptPackRuns(),
		promptPackSteps: r.many.promptPackSteps(),
	},
	promptPackSteps: {
		promptPack: r.one.promptPacks({
			from: r.promptPackSteps.packId,
			to: r.promptPacks.id
		}),
	},
	shareViews: {
		shareableLink: r.one.shareableLinks({
			from: r.shareViews.linkId,
			to: r.shareableLinks.id
		}),
	},
	shareableLinks: {
		shareViews: r.many.shareViews(),
	},
	sponsors: {
		contact: r.one.contacts({
			from: r.sponsors.contactId,
			to: r.contacts.id
		}),
		usersInAuth: r.one.usersInAuth({
			from: r.sponsors.createdBy,
			to: r.usersInAuth.id
		}),
		event: r.one.events({
			from: r.sponsors.eventId,
			to: r.events.id
		}),
	},
	sprintTasks: {
		campaign: r.one.campaigns({
			from: r.sprintTasks.campaignId,
			to: r.campaigns.id
		}),
	},
	sprints: {
		campaign: r.one.campaigns({
			from: r.sprints.campaignId,
			to: r.campaigns.id
		}),
	},
	startupEventTasks: {
		task: r.one.tasks({
			from: r.startupEventTasks.taskId,
			to: r.tasks.id
		}),
	},
	startupHealthScores: {
		startup: r.one.startups({
			from: r.startupHealthScores.startupId,
			to: r.startups.id
		}),
	},
	startupMembers: {
		usersInAuthInvitedBy: r.one.usersInAuth({
			from: r.startupMembers.invitedBy,
			to: r.usersInAuth.id,
			alias: "startupMembers_invitedBy_usersInAuth_id"
		}),
		startup: r.one.startups({
			from: r.startupMembers.startupId,
			to: r.startups.id
		}),
		usersInAuthUserId: r.one.usersInAuth({
			from: r.startupMembers.userId,
			to: r.usersInAuth.id,
			alias: "startupMembers_userId_usersInAuth_id"
		}),
	},
	userRoles: {
		usersInAuth: r.one.usersInAuth({
			from: r.userRoles.userId,
			to: r.usersInAuth.id
		}),
	},
	validatorAgentRuns: {
		validatorSession: r.one.validatorSessions({
			from: r.validatorAgentRuns.sessionId,
			to: r.validatorSessions.id
		}),
	},
	validatorSessions: {
		validatorAgentRuns: r.many.validatorAgentRuns(),
		startups: r.many.startups({
			from: r.validatorSessions.id.through(r.validatorReports.sessionId),
			to: r.startups.id.through(r.validatorReports.startupId)
		}),
		validatorRuns: r.many.validatorRuns(),
	},
	validatorRuns: {
		validatorSession: r.one.validatorSessions({
			from: r.validatorRuns.sessionId,
			to: r.validatorSessions.id
		}),
	},
	workflowActions: {
		workflow: r.one.workflows({
			from: r.workflowActions.workflowId,
			to: r.workflows.id
		}),
	},
	workflows: {
		workflowActions: r.many.workflowActions(),
		workflowTriggersViaWorkflowQueue: r.many.workflowTriggers({
			alias: "workflowTriggers_id_workflows_id_via_workflowQueue"
		}),
		workflowRuns: r.many.workflowRuns(),
		workflowTriggersWorkflowId: r.many.workflowTriggers({
			alias: "workflowTriggers_workflowId_workflows_id"
		}),
		usersInAuth: r.one.usersInAuth({
			from: r.workflows.createdBy,
			to: r.usersInAuth.id
		}),
		organization: r.one.organizations({
			from: r.workflows.orgId,
			to: r.organizations.id
		}),
		startup: r.one.startups({
			from: r.workflows.startupId,
			to: r.startups.id
		}),
	},
	workflowActivityLog: {
		organization: r.one.organizations({
			from: r.workflowActivityLog.orgId,
			to: r.organizations.id
		}),
		startup: r.one.startups({
			from: r.workflowActivityLog.startupId,
			to: r.startups.id
		}),
		task: r.one.tasks({
			from: r.workflowActivityLog.taskId,
			to: r.tasks.id
		}),
	},
	workflowTriggers: {
		workflows: r.many.workflows({
			from: r.workflowTriggers.id.through(r.workflowQueue.triggerId),
			to: r.workflows.id.through(r.workflowQueue.workflowId),
			alias: "workflowTriggers_id_workflows_id_via_workflowQueue"
		}),
		workflowRuns: r.many.workflowRuns(),
		workflow: r.one.workflows({
			from: r.workflowTriggers.workflowId,
			to: r.workflows.id,
			alias: "workflowTriggers_workflowId_workflows_id"
		}),
	},
	workflowRuns: {
		workflowQueue: r.one.workflowQueue({
			from: r.workflowRuns.queueId,
			to: r.workflowQueue.id
		}),
		workflowTrigger: r.one.workflowTriggers({
			from: r.workflowRuns.triggerId,
			to: r.workflowTriggers.id
		}),
		workflow: r.one.workflows({
			from: r.workflowRuns.workflowId,
			to: r.workflows.id
		}),
	},
	workflowQueue: {
		workflowRuns: r.many.workflowRuns(),
	},
	objectsInStorage: {
		bucketsInStorage: r.one.bucketsInStorage({
			from: r.objectsInStorage.bucketId,
			to: r.bucketsInStorage.id
		}),
	},
	bucketsInStorage: {
		objectsInStorages: r.many.objectsInStorage(),
		s3MultipartUploadsInStoragesBucketId: r.many.s3MultipartUploadsInStorage({
			alias: "s3MultipartUploadsInStorage_bucketId_bucketsInStorage_id"
		}),
		s3MultipartUploadsInStoragesViaS3MultipartUploadsPartsInStorage: r.many.s3MultipartUploadsInStorage({
			from: r.bucketsInStorage.id.through(r.s3MultipartUploadsPartsInStorage.bucketId),
			to: r.s3MultipartUploadsInStorage.id.through(r.s3MultipartUploadsPartsInStorage.uploadId),
			alias: "bucketsInStorage_id_s3MultipartUploadsInStorage_id_via_s3MultipartUploadsPartsInStorage"
		}),
	},
	s3MultipartUploadsInStorage: {
		bucketsInStorage: r.one.bucketsInStorage({
			from: r.s3MultipartUploadsInStorage.bucketId,
			to: r.bucketsInStorage.id,
			alias: "s3MultipartUploadsInStorage_bucketId_bucketsInStorage_id"
		}),
		bucketsInStorages: r.many.bucketsInStorage({
			alias: "bucketsInStorage_id_s3MultipartUploadsInStorage_id_via_s3MultipartUploadsPartsInStorage"
		}),
	},
	vectorIndexesInStorage: {
		bucketsVectorsInStorage: r.one.bucketsVectorsInStorage({
			from: r.vectorIndexesInStorage.bucketId,
			to: r.bucketsVectorsInStorage.id
		}),
	},
	bucketsVectorsInStorage: {
		vectorIndexesInStorages: r.many.vectorIndexesInStorage(),
	},
}))
"use client";

import { useState, useEffect } from "react";
import { WorkflowState } from "shared";

const CADENCE_INITIAL_EXAMPLE = {
	"id": "cad_123",
	"name": "Welcome Flow",
	"steps": [
		{
			"id": "1",
			"type": "SEND_EMAIL",
			"subject": "Welcome",
			"body": "Hello there"
		},
		{
			"id": "2",
			"type": "WAIT",
			"seconds": 10
		},
		{
			"id": "3",
			"type": "SEND_EMAIL",
			"subject": "Follow up",
			"body": "Checking in"
		}
	]
};

const ENROLLMENT_INITIAL_STEPS_UPDATE_EXAMPLE = [
	{
		"id": "1",
		"type": "SEND_EMAIL",
		"subject": "Welcome",
		"body": "Hello there"
	},
	{
		"id": "2",
		"type": "WAIT",
		"seconds": 10
	},
	{
		"id": "3",
		"type": "SEND_EMAIL",
		"subject": "Updated Follow up",
		"body": "Updated cadence steps"
	},
];

export default function Home() {
	const [cadenceJson, setCadenceJson] = useState(JSON.stringify(CADENCE_INITIAL_EXAMPLE, null, 2));
	const [updateStepsJson, setUpdateStepsJson] = useState(JSON.stringify(ENROLLMENT_INITIAL_STEPS_UPDATE_EXAMPLE, null, 2));

	const [contactEmail, setContactEmail] = useState("test@email.com");
	const [enrollmentId, setEnrollmentId] = useState<string | null>(null);
	const [workflowState, setWorkflowState] = useState<WorkflowState | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

	const safeParse = (value: string) => {
		try {
			return JSON.parse(value);
		} catch {
			throw new Error("Invalid JSON format");
		}
	};

	// Create Cadence
	const createCadence = async () => {
		try {
			setErrorMessage(null);
			const cadence = safeParse(cadenceJson);

			const resp = await fetch(`${API_BASE}/cadences`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(cadence),
			});

			if (!resp.ok) {
				const error = await resp.json();
				throw new Error(error.message || "Failed to create cadence");
			}

			alert("Cadence created");
		} catch (err: any) {
			setErrorMessage(err.message);
		}
	};

	// Enroll Contact
	const enroll = async () => {
		try {
			setErrorMessage(null);
			const cadence = safeParse(cadenceJson);

			const res = await fetch(`${API_BASE}/enrollments`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					cadenceId: cadence.id,
					contactEmail,
				}),
			});

			if (!res.ok) {
				const error = await res.json();
				throw new Error(error.message || "Failed to enroll");
			}

			const data = await res.json();
			setEnrollmentId(data.enrollmentId);
		} catch (err: any) {
			setErrorMessage(err.message);
		}
	};


	// Update Running Workflow
	const updateCadence = async () => {
		if (!enrollmentId) return;

		try {
			setErrorMessage(null);
			const steps = safeParse(updateStepsJson);

			const resp = await fetch(
				`${API_BASE}/enrollments/${enrollmentId}/update-cadence`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ steps }),
				}
			);

			if (!resp.ok) {
				const error = await resp.json();

				alert("Cadence update failed: " + (error.message || "Unknown error"));

				throw new Error(error.message || "Failed to update cadence");
			}

			alert("Cadence updated");
		} catch (err: any) {
			setErrorMessage(err.message);
		}
	};

	// Poll Workflow State
	useEffect(() => {
		if (!enrollmentId) return;

		const interval = setInterval(async () => {
			const res = await fetch(
				`${API_BASE}/enrollments/${enrollmentId}`
			);

			if (!res.ok) return;

			const data: WorkflowState = await res.json();

			setWorkflowState(data);

			if (data?.status === "COMPLETED") {
				clearInterval(interval);
			}
		}, 1000);

		return () => clearInterval(interval);
	}, [enrollmentId]);

	return (
		<div style={{ padding: 20 }}>
			<h1>Email Cadence Dashboard</h1>

			{errorMessage && (
				<div style={{ color: "red", marginBottom: 10 }}>
					{errorMessage}
				</div>
			)}

			<h2>1. Create Cadence</h2>
			<textarea
				rows={15}
				cols={80}
				value={cadenceJson}
				onChange={(e) => setCadenceJson(e.target.value)}
			/>
			<div style={{ marginTop: 10 }}>
				<button onClick={createCadence}>
					Create Cadence
				</button>
			</div>

			<hr style={{ margin: "30px 0" }} />

			<h2>2. Enroll Contact</h2>
			<input
				type="text"
				value={contactEmail}
				onChange={(e) => setContactEmail(e.target.value)}
				placeholder="Contact Email"
			/>
			<div style={{ marginTop: 10 }}>
				<button onClick={enroll}>Enroll</button>
			</div>

			<hr style={{ margin: "30px 0" }} />

			<h2>3. Update Running Workflow</h2>
			<textarea
				rows={10}
				cols={80}
				value={updateStepsJson}
				onChange={(e) => setUpdateStepsJson(e.target.value)}
			/>
			<div style={{ marginTop: 10 }}>
				<button
					onClick={updateCadence}
					disabled={!enrollmentId}
				>
					Update Workflow
				</button>
			</div>

			<hr style={{ margin: "30px 0" }} />

			<h2>4. Workflow State</h2>
			<pre>{JSON.stringify(workflowState, null, 2)}</pre>
		</div>
	);
}

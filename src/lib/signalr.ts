"use client";

import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from "@microsoft/signalr";

import { getAuthToken } from "@/hooks/useAuth";

const connections = new Map<string, HubConnection>();

export const getSignalRConnection = (hubUrl: string): HubConnection => {
  const existing = connections.get(hubUrl);
  if (existing) {
    return existing;
  }

  const connection = new HubConnectionBuilder()
    .withUrl(hubUrl, {
      accessTokenFactory: () => getAuthToken() ?? "",
      withCredentials: false,
    })
    .withAutomaticReconnect([0, 1000, 5000, 10000])
    .configureLogging(LogLevel.Warning)
    .build();

  connections.set(hubUrl, connection);
  return connection;
};

export const ensureSignalRStarted = async (connection: HubConnection) => {
  const getState = () => connection.state as HubConnectionState;

  if (getState() === HubConnectionState.Connected) {
    return;
  }

  const timeoutAt = Date.now() + 5000;
  while (getState() !== HubConnectionState.Connected && Date.now() < timeoutAt) {
    if (getState() === HubConnectionState.Disconnected) {
      await connection.start();
      continue;
    }

    await new Promise((resolve) => window.setTimeout(resolve, 100));
  }

  if (getState() !== HubConnectionState.Connected) {
    throw new Error("SignalR connection is not connected.");
  }
};

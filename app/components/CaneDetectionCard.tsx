import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { colors } from "../constants/colors";

const rawData = require("../data/demoCaneData.json") as {
  distance: number;
  zone: string;
}[];

type Sample = {
  distance: number;
  zone: string;
};

export const CaneDetectionCard: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState<Sample[]>([rawData[0]]);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % rawData.length;
        const sample = rawData[next];

        setHistory((h) => [sample, ...h].slice(0, 25));

        return next;
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const current = rawData[index];
  const zone = current.zone.toUpperCase();

  const zoneColor =
    zone === "SAFE"
      ? colors.successGreen
      : zone === "WARNING"
      ? colors.primaryPurple
      : colors.dangerRed;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.rowLeft}>
          <MaterialIcons name="radar" size={24} color={colors.primaryBlue} />
          <Text style={styles.title}>Object Detection</Text>
        </View>

        <View style={[styles.zonePill, { backgroundColor: zoneColor }]}>
          <Text style={styles.zoneText}>{zone}</Text>
        </View>
      </View>

      <Text style={styles.label}>Current distance</Text>
      <Text style={styles.distance}>{current.distance} cm</Text>

      <Text style={styles.label}>Recent readings</Text>

      <FlatList
        data={history}
        keyExtractor={(_, i) => i.toString()}
        style={styles.list}
        renderItem={({ item }) => {
          const z = item.zone.toUpperCase();
          const color =
            z === "SAFE"
              ? colors.successGreen
              : z === "WARNING"
              ? colors.primaryPurple
              : colors.dangerRed;

          return (
            <View style={styles.historyRow}>
              <Text style={styles.historyText}>{item.distance} cm</Text>
              <Text style={[styles.historyZone, { color }]}>{z}</Text>
            </View>
          );
        }}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderColor: colors.cardBorder,
    borderWidth: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    alignItems: "center",
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  zonePill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  zoneText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 12,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  distance: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.textPrimary,
    marginBottom: 16,
  },
  list: {
    maxHeight: 180,
  },
  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  historyText: {
    color: colors.textPrimary,
    fontSize: 14,
  },
  historyZone: {
    fontWeight: "600",
    fontSize: 14,
  },
});
"use client";
import React, { useEffect, useState } from "react";
import {
    Card, CardContent, Grid, Typography, List, ListItem,
    ListItemIcon, ListItemText
} from "@mui/material";
import { MdOutlineLightbulb } from "react-icons/md";
import {
    LineChart, BarChart, Bar, Line, XAxis, YAxis,
    Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts";

export default function DashboardPage() {
    const [data, setData] = useState([]);
    const [summary, setSummary] = useState("");
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetch("/api/dashboard")
            .then((res) => res.json())
            .then((res) => {
                setData(res.stats || []);
                setSummary(res.resumen || "");
                setTasks(res.recomendaciones || []);
            })
            .catch((err) => console.error("Error:", err));
    }, []);

    return (
        <Grid
            container
            spacing={3}
            sx={{width: "auto", margin: 0, padding: 3 }}
            flexDirection='column'
        >
            {/* --- Gráfico Ventas --- */}
            <Grid item xs={6} md={6}>
                <Card sx={{ flex: 1, borderRadius: 3, boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Ventas de la Semana
                        </Typography>
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="ventas"
                                    stroke="#1976d2"
                                    strokeWidth={3}
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </Grid>

            {/* --- Gráfico Compras --- */}
            <Grid item xs={6} md={6}>
                <Card sx={{ flex: 1, borderRadius: 3, boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Compras de la Semana
                        </Typography>
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="compras" fill="#9c27b0" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </Grid>

            {/* --- Resumen IA --- */}
            <Grid item xs={6} md={6}>
                <Card sx={{ flex: 1, borderRadius: 3, boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom color="primary">
                            Resumen de la Semana
                        </Typography>
                        <Typography variant="body1">{summary}</Typography>
                    </CardContent>
                </Card>
            </Grid>

            {/* --- Recomendaciones IA --- */}
            <Grid item xs={6} md={6}>
                <Card sx={{ flex: 1, borderRadius: 3, boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom color="secondary">
                            Recomendaciones de la IA
                        </Typography>
                        <List>
                            {tasks.map((task, i) => (
                                <ListItem key={i}>
                                    <ListItemIcon>
                                        <MdOutlineLightbulb style={{ color: "#ffb300" }} />
                                    </ListItemIcon>
                                    <ListItemText primary={task} />
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}

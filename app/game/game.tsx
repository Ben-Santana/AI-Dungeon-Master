'use client';
import { Adventurer, Spell } from "@/types/adventurer";
import GameChat from "../components/chat/chat";
import { memo, useState } from "react";
import SideBar from "../components/stats/sidebar";
import { User } from "@/types/user";

export default function Game({adventurer}: { adventurer: Adventurer }) {
    

    return (
        <div className="h-full flex flex-row">
            <div className="basis-1/4 custom_bg-dark-gray p-3">
                <SideBar player={adventurer}></SideBar>
            </div>
            <div className="basis-3/4 px-12 py-6 custom_bg-gray">
                <GameChat adventurer={adventurer}></GameChat>
            </div>
        </div>
    );
}


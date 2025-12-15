"use client"

import React from 'react'
import { ShoppingBag, Banknote, Images, Package } from "lucide-react"
import { GenericAnimatedIcon } from "./generic"
import { HomeIcon } from "./home"
import { SettingsIcon } from "./settings"
import { UsersIcon } from "./users"

// Specific Wrapper Components mimicking the API of HomeIcon
// So they can be used interchangeably

interface AnimatedIconProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: number | string
}

export const ShoppingBagIcon = (props: AnimatedIconProps) => (
    <GenericAnimatedIcon icon={ShoppingBag} animationType="bounce" {...props} />
)

export const BanknoteIcon = (props: AnimatedIconProps) => (
    <GenericAnimatedIcon icon={Banknote} animationType="shake" {...props} />
)

export const ImagesIcon = (props: AnimatedIconProps) => (
    <GenericAnimatedIcon icon={Images} animationType="scale" {...props} />
)

export const PackageIcon = (props: AnimatedIconProps) => (
    <GenericAnimatedIcon icon={Package} animationType="rotate" {...props} />
)

export { HomeIcon, SettingsIcon, UsersIcon }

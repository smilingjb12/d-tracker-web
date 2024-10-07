"use client";

import { nextEnv } from "@/nextEnv";
import { PlaneIcon, RocketIcon, SendIcon } from "lucide-react";
import { PricingCard } from "./pricing-card";

export default function UpgradePage() {
  return (
    <section className="container items-center justify-center max-w-6xl">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
            Purchase credits
          </h2>
          <p className="mb-5 font-light text-gray-500 sm:text-xl dark:text-gray-400">
            Every new image you create in the web application deducts a fixed
            amount of credits from your account balance.
          </p>
        </div>
        <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
          <PricingCard
            description="~$0.10 per image"
            stripePriceId={nextEnv.NEXT_PUBLIC_STRIPE_TIER_1_PRICEID}
            iconGenerator={() => <SendIcon className="size-14" />}
            credits={Number(nextEnv.NEXT_PUBLIC_STRIPE_TIER_1_CREDITS)}
          />
          <PricingCard
            description="~$0.09 per image"
            stripePriceId={nextEnv.NEXT_PUBLIC_STRIPE_TIER_2_PRICEID}
            iconGenerator={() => <PlaneIcon className="size-14" />}
            credits={Number(nextEnv.NEXT_PUBLIC_STRIPE_TIER_2_CREDITS)}
          />
          <PricingCard
            description="~$0.08 per image"
            stripePriceId={nextEnv.NEXT_PUBLIC_STRIPE_TIER_3_PRICEID}
            iconGenerator={() => <RocketIcon className="size-14" />}
            credits={Number(nextEnv.NEXT_PUBLIC_STRIPE_TIER_3_CREDITS)}
          />
        </div>
      </div>
    </section>
  );
}

import { apiFetch } from "@/lib/auth/client";

export async function GET(request: Request) {
  const url = `/api/dashboard/timesheets/configs/`
  console.log(url);
  try {
    const response = await apiFetch(url);

    return Response.json(response);
  } catch (error) {
    console.log("error", error);
    return Response.json(
      {
        message: "Failed to create Deduction. Please try again later.",
      },
      { status: 400 },
    );
  }
}

export async function POST(request: Request) {
  const body = await request.json()
  console.log(body)
  const djangoBody = {
    ...(body.postcodeRates && {
      postcodes: body.postcodeRates.map(
        ({ postcode, rate, effective_from }: { postcode: string; rate: number, effective_from: string }) => ({
          postcode,
          rate,
          effective_from
        }),
      ),
    }),

    ...(body.fuelPerStop !== undefined && {
      fuel_allowance: body.fuelPerStop,
    }),

    ...(body.incentivePerStop !== undefined && {
      stop_incentive: body.incentivePerStop,
    }),

    ...(body.vanDeduction !== undefined && {
      van_deduction: body.vanDeduction,
    }),
  }

  console.log("post", djangoBody)
  const response = await apiFetch(`/api/dashboard/timesheets/configs/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(djangoBody),
  })

  return Response.json(response);
}

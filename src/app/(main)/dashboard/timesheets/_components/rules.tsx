import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import PostcodeTable, { PostcodeRate } from "./postcode-table";
import { useState } from "react";
import isEqual from "lodash/isEqual";

interface FixedFields {
  fuelPerStop: number;
  incentivePerStop: number;
  vanDeduction: number;
}

interface EditableType extends FixedFields {
  postcodeRates: PostcodeRate[];
}

interface PostcodeChanges {
  updated: {
    id: number;
    before: PostcodeRate;
    after: PostcodeRate;
  }[];
  added: PostcodeRate[];
  deleted: PostcodeRate[];
}

interface ChangedFields {
  fuelPerStop?: {
    before: number;
    after: number;
  };
  incentivePerStop?: {
    before: number;
    after: number;
  };
  vanDeduction?: {
    before: number;
    after: number;
  };
  postcodeRates?: PostcodeChanges;
}

function getChangedFields(
  original: EditableType,
  updated: EditableType,
): ChangedFields {
  const changes: ChangedFields = {};

  // Simple fields
  if (!isEqual(original.fuelPerStop, updated.fuelPerStop)) {
    changes.fuelPerStop = {
      before: original.fuelPerStop,
      after: updated.fuelPerStop,
    };
  }

  if (!isEqual(original.incentivePerStop, updated.incentivePerStop)) {
    changes.incentivePerStop = {
      before: original.incentivePerStop,
      after: updated.incentivePerStop,
    };
  }

  if (!isEqual(original.vanDeduction, updated.vanDeduction)) {
    changes.vanDeduction = {
      before: original.vanDeduction,
      after: updated.vanDeduction,
    };
  }

  // Postcode rates
  const updatedPostcodes = [];
  const addedPostcodes = [];
  const deletedPostcodes = [];

  // Find updated and added records
  for (const updatedRate of updated.postcodeRates) {
    const originalRate = original.postcodeRates.find(
      (rate) => rate.id === updatedRate.id,
    );

    // New record
    if (!originalRate) {
      addedPostcodes.push(updatedRate);
      continue;
    }

    // Existing record that changed
    if (!isEqual(originalRate, updatedRate)) {
      updatedPostcodes.push({
        id: updatedRate.id,
        before: originalRate,
        after: updatedRate,
      });
    }
  }

  // Find deleted records
  for (const originalRate of original.postcodeRates) {
    const stillExists = updated.postcodeRates.some(
      (rate) => rate.id === originalRate.id,
    );

    if (!stillExists) {
      deletedPostcodes.push(originalRate);
    }
  }

  if (
    updatedPostcodes.length > 0 ||
    addedPostcodes.length > 0 ||
    deletedPostcodes.length > 0
  ) {
    changes.postcodeRates = {
      updated: updatedPostcodes,
      added: addedPostcodes,
      deleted: deletedPostcodes,
    };
  }

  return changes;
}

function getPostcodeRates(): PostcodeRate[] {
  return [
    {
      id: "1",
      date: "24/12/2026",
      postcode: "ME",
      rate: 20
    },
    {
      id: "2",
      date: "24/12/2026",
      postcode: "MEs",
      rate: 20
    },
    {
      id: "3",
      date: "24/12/2026",
      postcode: "MEx",
      rate: 20
    },
    {
      id: "4",
      date: "24/12/2026",
      postcode: "MEb",
      rate: 20
    },
  ]
}

export default function Rules() {
  const [open, setOpen] = useState(false)
  const [showChanges, setShowChanges] = useState(false)
  const [originalItems, setOriginalItems] = useState<EditableType>({
    postcodeRates: getPostcodeRates(),
    fuelPerStop: 0.4,
    incentivePerStop: 0.2,
    vanDeduction: 0.4
  })

  const [visibleItems, setVisibleItems] = useState<EditableType>({
    postcodeRates: getPostcodeRates(),
    fuelPerStop: 0.4,
    incentivePerStop: 0.2,
    vanDeduction: 0.4
  })

  const [changes, setChangedItems] = useState<ChangedFields>({})


  const updateItems = (values: Partial<EditableType>) => {
    setVisibleItems((prev) => {
      return { ...prev, ...values }
    })
  }

  const verifyChanges = () => {
    const result = getChangedFields(originalItems, visibleItems)
    if (Object.keys(result).length > 0) {
      setShowChanges(true)
      setChangedItems(result)
    } else {
      cancelHandler()

    }
  }

  const submitChanges = () => {
    const result = getChangedFields(originalItems, visibleItems)
    if (Object.keys(result).length > 0) {
      // UPDATE OGIRINAL ITEM
      cancelHandler()
    }
  }

  const cancelHandler = () => {
    setOpen(false)
    setShowChanges(false)
    setChangedItems({})
    setVisibleItems(originalItems)
  }

  return (
    <Dialog open={open} onOpenChange={(open) => {
      if (open === false) {
        cancelHandler()
      }
      setOpen(open)
    }}>
      <DialogTrigger asChild>
        <Button variant={"outline"} size={"sm"}>
          Rules
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        {showChanges
          ?
          <>
            <DialogHeader>
              <DialogTitle>Confirm Changes</DialogTitle>
              <DialogDescription>Carefully verify the changes and submit when certain</DialogDescription>
            </DialogHeader>
            {changes.fuelPerStop && (
              <p>
                Fuel per stop:{" "}
                {changes.fuelPerStop.before} → {changes.fuelPerStop.after}
              </p>
            )}

            {changes.incentivePerStop && (
              <p>
                Incentive per stop:{" "}
                {changes.incentivePerStop.before} → {changes.incentivePerStop.after}
              </p>
            )}

            {changes.vanDeduction && (
              <p>
                Van deduction:{" "}
                {changes.vanDeduction.before} → {changes.vanDeduction.after}
              </p>
            )}

            {changes.postcodeRates && (
              <div>
                <h3 className="font-extrabold">Postcode rates</h3>
                <div className="flex flex-wrap gap-5">
                  {changes.postcodeRates.updated.length > 0 && (
                    <div className="border w-fit p-3 rounded-md mt-3">
                      <h4 className="font-bold">Updated</h4>

                      {changes.postcodeRates.updated.map((change) => (
                        <div key={change.id} className="mt-3">
                          <p className="flex place-items-center gap-3">
                            Postcode: <span className="text-red-500">{change.before.postcode}</span> → <span className="text-green-500">{change.after.postcode}</span>
                          </p>

                          <p className="flex place-items-center gap-3">
                            Rate: <span className="text-red-500">{change.before.rate}</span> → <span className="text-green-500">{change.after.rate}</span>
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {changes.postcodeRates.added.length > 0 && (
                    <div className="border w-fit p-3 rounded-md mt-3">
                      <h4>Added</h4>

                      {changes.postcodeRates.added.map((rate) => (
                        <div key={rate.id}>
                          <p className="text-green-500">
                            {rate.postcode} — {rate.rate}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {changes.postcodeRates.deleted.length > 0 && (
                    <div className="border w-fit p-3 rounded-md mt-3">
                      <h4>Removed</h4>

                      {changes.postcodeRates.deleted.map((rate) => (
                        <div key={rate.id}>
                          <p className="text-red-500">
                            {rate.postcode} — {rate.rate}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant={"outline"} onClick={() => setShowChanges(false)} >
                &larr; back
              </Button>
              <Button type="submit" variant={"default"} onClick={submitChanges}>
                Submit
              </Button>
            </DialogFooter>
          </>
          :
          <>
            <DialogHeader>
              <DialogTitle>Predifined Rules</DialogTitle>
              <DialogDescription>Pre-define the rules for the timesheet</DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-5" onSubmit={(event) => event.preventDefault()}>
              <FieldGroup>
                <Field>
                  <PostcodeTable postcodeRates={visibleItems.postcodeRates} onChange={(value: PostcodeRate[]) => updateItems({ postcodeRates: value })} />
                </Field>
                <div className="grid gap-4 sm:grid-cols-3 mt-5">
                  <Field>
                    <FieldLabel htmlFor="fuel-field">Fuel Allowance (p/s)</FieldLabel>
                    <Input
                      id="fuel-field"
                      placeholder="0.40"
                      type="number"
                      onChange={(e) => updateItems({ fuelPerStop: Number(e.currentTarget.value) })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="incentive-field">Incentive (p/s)</FieldLabel>
                    <Input
                      id="incentive-field"
                      placeholder="0.20"
                      type="number"
                      onChange={(e) => updateItems({ incentivePerStop: Number(e.currentTarget.value) })}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="van-deduc-field">Van Deductions</FieldLabel>
                    <Input
                      id="van-deduc-field"
                      placeholder="0.40"
                      type="number"
                      onChange={(e) => updateItems({ vanDeduction: Number(e.currentTarget.value) })}
                    />
                  </Field>
                </div>
              </FieldGroup>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant={"outline"} onClick={cancelHandler} >
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" variant={"default"} onClick={verifyChanges}>
                Submit
              </Button>
            </DialogFooter>
          </>
        }
      </DialogContent>
    </Dialog>
  )
}

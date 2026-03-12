import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function TeamCard({
  team,
  teamIndex,
  roles,
  updateTeamName,
  addRole,
  removeRole,
  updateRole,
  removeTeam,
  serviceId,
  viewTeam,
  onDeleteTeamFromDB,
}) {
  const deleteTeam = () => {
    removeTeam(teamIndex);

    if (viewTeam) {
      onDeleteTeamFromDB(serviceId, team.name);
    }
  };
  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <Input
          placeholder="Nom de l'équipe"
          value={team.name}
          onChange={(e) => updateTeamName(teamIndex, e.target.value)}
        />
        <Button
          variant="destructive"
          size="sm"
          onClick={() => deleteTeam()}
        >
          Supprimer l'équipe
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* input du nom de l'équipe */}

        {/* Bouton pour ajouter unrôle */}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => addRole(teamIndex)}
        >
          Ajouter un rôle
        </Button>

        {/* Liste des rôles */}
        {team.roles.map((role, roleIndex) => (
          <div key={roleIndex} className="flex gap-2 items-end">
            <div className="flex-1 space-y-2">
              <Label>Rôle / poste</Label>
              <Input
                placeholder="Nom du rôle"
                value={role.name}
                onChange={(e) =>
                  updateRole(teamIndex, roleIndex, "name", e.target.value)
                }
              />

              {/* <Select
								value={role.name}
								onValueChange={(value) =>
									updateRole(
										teamIndex,
										roleIndex,
										"name",
										value,
									)
								}
							>
								<SelectTrigger>
									<SelectValue placeholder="Sélectionner un emploi" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										{roles.map((r) => (
											<SelectItem
												key={r.value}
												value={r.value}
											>
												{r.label}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select> */}
            </div>

            <div className="w-16 space-y-2">
              <Label>Nombre</Label>
              <Input
                type="number"
                min="0"
                value={role.need}
                onChange={(e) =>
                  updateRole(
                    teamIndex,
                    roleIndex,
                    "need",
                    Number(e.target.value),
                  )
                }
              />
            </div>

            <Button
              variant="destructive"
              size="icon"
              onClick={() => removeRole(teamIndex, roleIndex)}
            >
              ✕
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

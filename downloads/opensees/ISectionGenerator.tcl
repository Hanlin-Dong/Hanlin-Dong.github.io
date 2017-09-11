#############################################################
# file: ISectionGenerator.tcl
# author: Hanlin DONG
# version: 2.0
# license: MIT License (https://opensource.org/licenses/MIT)
# last update: 2017-09-01 13:00
# (The latest version can be found on http://www.hanlindong.com/)
# readme: 
#   This file defines a procedure to generate I section.
#   The local 2 axis is parallel to web by default (rot=False).
#   WARNING: In main file, secTag must be 1~999!
#            Material Tag 1xxx ~ 4xxxx are used to define section generator.
# change log:
#   2017-05-07 17:00 v1.0
#     Create file, define the procedure. Not tested yet.
#   2017-05-07 19:30 v1.1
#     Create a test file and passed the test after bug fixes.
#     bugs: uniaxial Elastic material, dollar sign, aggregate flag ...
#   2017-05-16 17:00 v1.2
#     Add material tag warning.
#   2017-09-01 13:00 v2.0
#     Change name to ISectionGenerator.
#############################################################


## Graph:(rot=False)
#               ^z
#     _         |         _
#    | |        |        | |
#    | |        |        | |
#    | |        |        | |
#    | |        |        | |
# ---+-+=================+-+---->y
#    | |        |        | |
#    | |        |        | |
#    | |        |        | |
#    |_|        |        |_|
#               |

## Args:
# h: height
# w: width
# tw: thickness of web
# tf: thickness of flange
# moe: modulus of elasticity
# nu: poisson's ratio
# matTag: material used for fiber section
# secTag: the section tag for this section
# flayer: number of meshed layers of flange
# wlayer: number of meshed layers of web
# method: an enumerate: method='L': mesh by max length; method='N': mesh by number
# alphaf: max length or mesh number for flange
# alphaw: max length or mesh number for web
# aggregate: boolean If aggregate=True, shear and tortion modulus are aggregated using elastic material.
# rot: boolean. If rot=True, rotate 2 axis by 90 degrees(used for planar situation)

puts "ISectionGenerator.tcl v2.0 loaded successfully (Copyright: Hanlin DONG, License: MIT) ..."

proc ISectionGenerator {h w tw tf moe nu matTag secTag flayer wlayer method alphaf alphaw aggregate rot} {
    
    if {$method == "L"} {
        set nf [expr int([expr ceil([expr 1.0 * $w / $alphaf])])]
        set nw [expr int([expr ceil([expr 1.0 * ($h - 2 * $tf) / $alphaw])])]
    } else {
        set nf $alphaf
        set nw $alphaw
    }

    if {$aggregate} {
        set fiberTag [expr $secTag + 1000]
    } else {
        set fiberTag $secTag
    }

    if {$rot} {
        section Fiber $fiberTag {
        # patch rect $matTag $numSubdivY $numSubdivZ $yI $zI $yJ $zJ
            patch rect $matTag $nf $flayer [expr $w / -2.0] [expr $h / 2.0 - $tf] [expr $w / 2.0] [expr $h / 2.0] 
            patch rect $matTag $nf $flayer [expr $w / -2.0] [expr $h / -2.0] [expr $w / 2.0] [expr $h / -2.0 + $tf] 
            patch rect $matTag $wlayer $nw [expr $tw / -2.0] [expr $h / -2.0 + $tf] [expr $tw / 2.0] [expr $h / 2.0 - $tf]
        }
    } else {
        section Fiber $fiberTag {
            patch rect $matTag $flayer $nf [expr $h / 2.0 - $tf] [expr $w / -2.0] [expr $h / 2.0] [expr $w / 2.0]
            patch rect $matTag $flayer $nf [expr $h / -2.0] [expr $w / -2.0] [expr $h / -2.0 + $tf] [expr $w / 2.0]
            patch rect $matTag $nw $wlayer [expr $h / -2.0 + $tf] [expr $tw / -2.0] [expr $h / 2.0 - $tf] [expr $tw / 2.0]
        }
    }

    if {$aggregate} {
        set tagT [expr $secTag + 2000]
        set tagVmaj [expr $secTag + 3000]
        set tagVmin [expr $secTag + 4000]
        set mos [expr $moe / 2.0 / (1 + $nu)]
        set k1 [expr $w * [expr pow($tf, 3)] * (1.0/3 - 0.21 * $tf / $w * (1 - [expr pow($tf / $w * 1.0, 4)] / 12))]
        set k2 [expr 1.0/3 * (0.5 * $h - $tf) * [expr pow($tw, 3)]]
        set r [expr ($tw * $tw + 4 * $tf * $tf) / (8.0 * $tf)]
        set alpha [expr [expr min($tw, $tf)] * 1.0 / [expr max($tw, $tf)] * (0.15 + 0.1 * $r / $tf)]
        set d [expr ([expr pow($tf + $r, 2)] + $r * $tw + [expr pow($tw / 2.0, 2)]) * 1.0 / (2 * $r + $tf)]
        set tprop [expr 2 * $k1 + $k2 + 2 * $alpha * [expr pow($d, 4)]]
        set stiffT [expr $mos * $tprop]
        set stiffVmaj [expr $mos * $h * $tw]
        set stiffVmin [expr $mos * $w * $tf * 5.0 / 3]
        uniaxialMaterial Elastic $tagT $stiffT
        uniaxialMaterial Elastic $tagVmaj $stiffVmaj
        uniaxialMaterial Elastic $tagVmin $stiffVmin
        if {$rot} {
            section Aggregator $secTag $tagVmin Vy $tagVmaj Vz $tagT T -section $fiberTag
        } else {
            section Aggregator $secTag $tagVmaj Vy $tagVmin Vz $tagT T -section $fiberTag
        }
    }
    set msg "Section $secTag successfully generated using ISectionGenerator v2.0.
    Geometry properties: dimension: $h x $w x $tw x $tf rotated: $rot.
    Material properties: fiber section matTag: $matTag, aggregate: $aggregate, moe: $moe, nu: $nu.
    Mesh control: flange: $flayer layers and $nf parts. web: $wlayer layers and $nw parts."
    puts $msg
    return $msg
}

